const Vault = require("../models/Vault");
const createAuditLog = require("../utils/createAuditLog");
const crypto = require("crypto");
const path = require("path");

const {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = require("../config/s3");
const detectFileType = require("../utils/detectFileType");

const resolveFileKey = (file) => {
  if (file.filePath) return file.filePath;

  try {
    const url = new URL(file.fileUrl);
    if (
      url.protocol === "s3:" &&
      url.hostname === process.env.AWS_BUCKET_NAME
    ) {
      return decodeURIComponent(url.pathname.slice(1));
    }

    if (url.hostname.endsWith(".amazonaws.com")) {
      let key = decodeURIComponent(url.pathname.slice(1));
      if (url.hostname.startsWith("s3.") || url.hostname.startsWith("s3-")) {
        const prefix = `${process.env.AWS_BUCKET_NAME}/`;
        if (key.startsWith(prefix)) key = key.slice(prefix.length);
      }
      return key || null;
    }
  } catch {
    return null;
  }

  return null;
};

// ======================
// Upload File
// ======================
const uploadFile = async (req, res) => {
  let uploadedKey;
  let s3Uploaded = false;
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please select a document to upload.",
      });
    }

    const detectedType = detectFileType(req.file.buffer);
    const originalExtension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions =
      detectedType?.extension === "jpg"
        ? [".jpg", ".jpeg"]
        : detectedType
          ? [`.${detectedType.extension}`]
          : [];
    if (!detectedType || !allowedExtensions.includes(originalExtension)) {
      return res.status(400).json({
        message: "Only valid PDF, PNG, and JPEG documents are accepted.",
      });
    }

    uploadedKey = `vault/${req.user.id}/${crypto.randomUUID()}.${detectedType.extension}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedKey,
        Body: req.file.buffer,
        ContentType: detectedType.mime,
      }),
    );
    s3Uploaded = true;

    const newFile = await Vault.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `s3://${process.env.AWS_BUCKET_NAME}/${uploadedKey}`,
      filePath: uploadedKey,
      fileType: detectedType.mime,
      fileSize: req.file.size,
    });

    await createAuditLog(
      req.user.id,
      "Upload File",
      "Vault",
      `Uploaded document: ${req.file.originalname}`,
    );

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    if (s3Uploaded && uploadedKey) {
      await s3
        .send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uploadedKey,
          }),
        )
        .catch((cleanupErr) => {
          console.error(`Orphaned S3 object cleanup failed: ${cleanupErr.name}`);
        });
    }

    console.error(`[Vault Upload Error] ${error.name || "Error"}: ${error.message || "Failed"}`);

    if (error.name === "SignatureDoesNotMatch") {
      return res.status(500).json({
        message:
          "Storage service authentication failed (SignatureDoesNotMatch). Please verify that AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY match in your backend configuration.",
      });
    }

    if (error.name === "NoSuchBucket") {
      return res.status(500).json({
        message:
          "Configured storage bucket does not exist. Please verify your AWS S3 bucket configuration.",
      });
    }

    if (error.name === "AccessDenied") {
      return res.status(500).json({
        message:
          "Access denied by storage service. Please check your AWS IAM S3 permissions.",
      });
    }

    res.status(500).json({
      message: "File upload failed. Please try again later.",
    });
  }
};

// ======================
// Get Files
// ======================
const getFiles = async (req, res) => {
  try {
    const files = await Vault.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    console.error(`Vault list failed (${error.name}).`);

    res.status(500).json({
      message: "Could not load vault files.",
    });
  }
};

// ======================
// View File
// ======================
const viewFile = async (req, res) => {
  try {
    const file = await Vault.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const fileKey = resolveFileKey(file);
    if (!fileKey) {
      return res.status(400).json({
        message: "File path missing",
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    res.status(200).json({
      url: signedUrl,
    });
  } catch (error) {
    console.error(`Vault view failed (${error.name}).`);

    res.status(500).json({
      message: "Could not open the vault file.",
    });
  }
};

// ======================
// Delete File
// ======================
const deleteFile = async (req, res) => {
  try {
    const file = await Vault.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const fileKey = resolveFileKey(file);
    if (!fileKey) {
      return res.status(400).json({ message: "File path missing" });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      }),
    );

    await Vault.findByIdAndDelete(file._id);

    await createAuditLog(
      req.user.id,
      "Delete File",
      "Vault",
      `Deleted document: ${file.fileName}`,
    );

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error(`Vault deletion failed (${error.name}).`);

    res.status(500).json({
      message: "Could not delete the vault file.",
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  viewFile,
  deleteFile,
};
