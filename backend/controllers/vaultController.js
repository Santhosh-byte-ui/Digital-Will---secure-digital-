const Vault = require("../models/Vault");
const createAuditLog = require("../utils/createAuditLog");

const {
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = require("../config/s3");

// ======================
// Upload File
// ======================
const uploadFile = async (req, res) => {
  try {
    console.log("UPLOAD API HIT");
    console.log("REQ.FILE =", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const newFile = await Vault.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: req.file.location,
      filePath: req.file.key, // save object key also
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    await createAuditLog(
      req.user.id,
      "Upload File",
      "Vault",
      `Uploaded document: ${req.file.originalname}`
    );

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
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
      files,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
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

    let fileKey = "";

    if (file.filePath) {
      fileKey = file.filePath;
    } else if (file.fileUrl) {
      fileKey = decodeURIComponent(
        file.fileUrl.split(".amazonaws.com/")[1]
      );
    } else {
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
    console.log(error);

    res.status(500).json({
      message: error.message,
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

    let fileKey = "";

    if (file.filePath) {
      fileKey = file.filePath;
    } else if (file.fileUrl) {
      fileKey = decodeURIComponent(
        file.fileUrl.split(".amazonaws.com/")[1]
      );
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      })
    );

    await Vault.findByIdAndDelete(file._id);

    await createAuditLog(
      req.user.id,
      "Delete File",
      "Vault",
      `Deleted document: ${file.fileName}`
    );

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  viewFile,
  deleteFile,
};