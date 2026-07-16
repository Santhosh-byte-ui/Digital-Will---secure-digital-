const express = require("express");

const {
  getAdminStats,
} = require("../controllers/adminController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  getAdminStats
);

module.exports = router;