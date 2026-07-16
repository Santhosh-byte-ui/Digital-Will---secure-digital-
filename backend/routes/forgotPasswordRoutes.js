const express = require("express");

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/forgotPasswordController");

const router = express.Router();

// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password/:token",
  resetPassword
);

module.exports = router;