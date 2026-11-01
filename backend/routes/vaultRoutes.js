const express = require("express");

const {
  uploadFile,
  getFiles,
  viewFile,
  deleteFile,
} = require("../controllers/vaultController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload File
router.post("/upload", protect, upload.single("file"), uploadFile);

// Get My Files
router.get("/", protect, getFiles);

// ✅ View File (Generate Secure S3 URL)
router.get("/view/:id", protect, viewFile);

// Delete File
router.delete("/:id", protect, deleteFile);

module.exports = router;
