const Beneficiary = require("../models/Beneficiary");


// Add Beneficiary
const addBeneficiary = async (req, res) => {
  try {
    const {
      name,
      relationship,
      email,
      mobile,
      sharePercentage,
    } = req.body;

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
      message: error.message,
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
      message: error.message,
    });
  }
};


// Update Beneficiary
const updateBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Beneficiary updated successfully",
      beneficiary,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      message: error.message,
    });
  }
};


module.exports = {
  addBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary,
};