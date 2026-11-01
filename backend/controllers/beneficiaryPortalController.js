const Will = require("../models/Will");

// View Beneficiary Will
const getBeneficiaryWill = async (req, res) => {
  try {
    const will = await Will.findOne({
      "beneficiaries.email": req.user.email,
      deathVerificationStatus: "Verified",
    });

    if (!will) {
      return res.status(404).json({
        message: "No verified will found for this beneficiary",
      });
    }

    res.status(200).json({
      message: "Beneficiary will fetched successfully",
      will,
    });
  } catch (error) {
    console.error(`Beneficiary will lookup failed (${error.name}).`);
    res.status(500).json({
      message: "Could not load the beneficiary will.",
    });
  }
};

module.exports = {
  getBeneficiaryWill,
};
