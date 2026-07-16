const express = require("express");

const {
  addAsset,
  getAssets,
  updateAsset,
  deleteAsset,
} = require("../controllers/assetController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addAsset);

router.get("/", protect, getAssets);

router.put("/:id", protect, updateAsset);

router.delete("/:id", protect, deleteAsset);

module.exports = router;