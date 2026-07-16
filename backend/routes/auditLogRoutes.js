const express = require("express");

const { getAuditLogs } = require("../controllers/auditLogController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get User Audit Logs
router.get("/", protect, getAuditLogs);

module.exports = router;