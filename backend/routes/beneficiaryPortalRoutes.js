const express = require("express");

const {
  getBeneficiaryWill,
} = require("../controllers/beneficiaryPortalController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// View Beneficiary Will
router.get(
  "/my-will",
  protect,
  getBeneficiaryWill
);

module.exports = router;