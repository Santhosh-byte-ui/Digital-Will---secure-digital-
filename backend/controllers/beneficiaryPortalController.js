const Will = require("../models/Will");

// View Beneficiary Will
const getBeneficiaryWill = async (req, res) => {
  try {
    console.log("========== BENEFICIARY DEBUG ==========");
    console.log("Logged in User:", req.user);

    const allWills = await Will.find();

    console.log("All Wills in Database:");
    console.log(JSON.stringify(allWills, null, 2));

    const will = await Will.findOne({
      "beneficiaries.email": req.user.email,
      deathVerificationStatus: "Verified",
    });

    console.log("Matched Will:");
    console.log(will);

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
    console.log("❌ BENEFICIARY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getBeneficiaryWill,
};