const express = require("express");

const { downloadWillPDF } = require("../controllers/pdfController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Download Will as PDF
router.get("/download/:id", protect, downloadWillPDF);

module.exports = router;