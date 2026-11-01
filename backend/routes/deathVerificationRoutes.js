const express = require("express");

const {
  submitVerificationRequest,
  getAllVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
} = require("../controllers/deathVerificationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Verification Requests (Admin)
router.get("/", protect, authorizeRoles("admin"), getAllVerificationRequests);

// Submit Death Verification Request
router.post("/submit", protect, submitVerificationRequest);

// Approve Verification Request
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("admin"),
  approveVerificationRequest,
);

router.put(
  "/reject/:id",
  protect,
  authorizeRoles("admin"),
  rejectVerificationRequest,
);

module.exports = router;
