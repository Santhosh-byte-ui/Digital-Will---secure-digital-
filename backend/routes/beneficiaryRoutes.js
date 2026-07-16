const express = require("express");

const {
  addBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Protected Beneficiary Routes

router.post("/", protect, addBeneficiary);

router.get("/", protect, getBeneficiaries);

router.put("/:id", protect, updateBeneficiary);

router.delete("/:id", protect, deleteBeneficiary);


module.exports = router;