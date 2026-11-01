const express = require("express");
const {
  getAuditLogs,
  getAdminAuditLogs,
  getCategories,
} = require("../controllers/auditLogController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Category discovery endpoint
router.get("/categories", protect, getCategories);

// Administrator activity history endpoint
router.get("/admin", protect, authorizeRoles("admin"), getAdminAuditLogs);

// User-scoped activity history endpoint
router.get("/", protect, getAuditLogs);

module.exports = router;
