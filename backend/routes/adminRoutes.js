const express = require("express");

const { getAdminStats } = require("../controllers/adminController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

module.exports = router;
