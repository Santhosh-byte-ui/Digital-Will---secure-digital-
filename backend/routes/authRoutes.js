const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateEmergencyContact,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const {
  loginLimiter,
  registrationLimiter,
  recoveryLimiter,
} = require("../middleware/rateLimiters");

const router = express.Router();

// Public Routes
router.post("/register", registrationLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", recoveryLimiter, forgotPassword);
router.post("/reset-password/:token", recoveryLimiter, resetPassword);

// Protected Routes
router.get("/profile", protect, getProfile);

router.put("/emergency-contact", protect, updateEmergencyContact);

module.exports = router;
