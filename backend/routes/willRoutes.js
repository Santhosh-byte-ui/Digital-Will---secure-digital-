const express = require("express");

const {
  createWill,
  getMyWills,
  getWillById,
  updateWill,
  deleteWill,
} = require("../controllers/willController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Digital Will
router.post("/create", protect, createWill);

// Get My Wills
router.get("/my-wills", protect, getMyWills);

// Get Single Will
router.get("/:id", protect, getWillById);

// Update Will
router.put("/update/:id", protect, updateWill);

// Delete Will
router.delete("/delete/:id", protect, deleteWill);

module.exports = router;