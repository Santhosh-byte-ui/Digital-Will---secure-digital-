const Beneficiary = require("../models/Beneficiary");

// Add Beneficiary
const addBeneficiary = async (req, res) => {
  try {
    const { name, relationship, email, mobile, sharePercentage } = req.body;

    const beneficiary = await Beneficiary.create({
      user: req.user.id,
      name,
      relationship,
      email,
      mobile,
      sharePercentage,
    });

    res.status(201).json({
      message: "Beneficiary added successfully",
      beneficiary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create the beneficiary.",
    });
  }
};

// Get Beneficiaries
const getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({
      user: req.user.id,
    });

    res.status(200).json({
      beneficiaries,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load beneficiaries.",
    });
  }
};

// Update Beneficiary
const updateBeneficiary = async (req, res) => {
  try {
    const updates = {};
    for (const field of [
      "name",
      "relationship",
      "email",
      "mobile",
      "sharePercentage",
    ]) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const beneficiary = await Beneficiary.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    res.status(200).json({
      message: "Beneficiary updated successfully",
      beneficiary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update the beneficiary.",
    });
  }
};

// Delete Beneficiary
const deleteBeneficiary = async (req, res) => {
  try {
    await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.status(200).json({
      message: "Beneficiary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete the beneficiary.",
    });
  }
};

module.exports = {
  addBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary,
};
