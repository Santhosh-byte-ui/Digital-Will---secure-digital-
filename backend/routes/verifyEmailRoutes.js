const express = require("express");

const {
  verifyEmail,
} = require("../controllers/verifyEmailController");

const router = express.Router();

// Verify Email
router.get(
  "/verify-email/:token",
  verifyEmail
);

module.exports = router;