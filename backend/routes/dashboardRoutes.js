const express = require("express");

const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard Stats
router.get("/", protect, getDashboardStats);

module.exports = router;