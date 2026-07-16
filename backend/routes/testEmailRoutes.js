const express = require("express");

const {
  sendTestEmail,
} = require("../controllers/testEmailController");

const router = express.Router();

router.get("/send", sendTestEmail);

module.exports = router;