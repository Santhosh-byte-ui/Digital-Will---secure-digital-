const Vault = require("../models/Vault");
const createAuditLog = require("../utils/createAuditLog");
const {
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

// Upload File
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
      message: "File uploaded to AWS S3 successfully",
      file: newFile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Files
const getFiles = async (req, res) => {
  try {
    console.log("Logged User ID:", req.user.id);

    const files = await Vault.find({
      user: req.user.id,
    });

    console.log("Files in DB:", files);

    res.status(200).json({
      files,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete File
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

    // Delete from AWS S3
    const fileKey = decodeURIComponent(
      file.fileUrl.split(".amazonaws.com/")[1]
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      })
    );

    // Delete from MongoDB
    await Vault.findByIdAndDelete(file._id);
    await createAuditLog(
      req.user.id,
      "Delete File",
      "Vault",
      `Deleted document: ${file.fileName}`
    );

    res.status(200).json({
      message:
        "File deleted from AWS S3 and MongoDB successfully",
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
  deleteFile,
};