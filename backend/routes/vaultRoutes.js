const express = require("express");

const {
  uploadFile,
  getFiles,
  deleteFile,
} = require("../controllers/vaultController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ message: "Test route working" });
});

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadFile
);

router.get("/", protect, getFiles);

router.delete("/:id", protect, deleteFile);

module.exports = router;