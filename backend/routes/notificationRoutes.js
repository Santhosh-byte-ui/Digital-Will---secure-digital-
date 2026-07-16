const express = require("express");

const { getNotifications } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get Notifications
router.get("/", protect, getNotifications);

module.exports = router;