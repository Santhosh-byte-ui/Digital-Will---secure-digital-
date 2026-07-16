const express = require("express");

const {
  submitVerificationRequest,
  getAllVerificationRequests,
  approveVerificationRequest,
} = require("../controllers/deathVerificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Verification Requests (Admin)
router.get(
  "/",
  protect,
  getAllVerificationRequests
);

// Submit Death Verification Request
router.post(
  "/submit",
  protect,
  submitVerificationRequest
);

// Approve Verification Request
router.put(
  "/approve/:id",
  protect,
  approveVerificationRequest
);

module.exports = router;