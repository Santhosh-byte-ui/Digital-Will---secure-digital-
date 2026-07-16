const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateEmergencyContact,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token",resetPassword);

// Protected Routes
router.get("/profile", protect, getProfile);

router.put(
  "/emergency-contact",
  protect,
  updateEmergencyContact
);

module.exports = router;