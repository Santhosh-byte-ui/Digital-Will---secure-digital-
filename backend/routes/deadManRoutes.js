const express = require("express");

const {
  updateDeadManSettings,
} = require("../controllers/deadManController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/settings",
  protect,
  updateDeadManSettings
);

module.exports = router;