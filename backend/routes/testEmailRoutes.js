const express = require("express");

const { sendTestEmail } = require("../controllers/testEmailController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { testEmailLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post(
  "/send",
  protect,
  authorizeRoles("admin"),
  testEmailLimiter,
  sendTestEmail,
);

module.exports = router;
