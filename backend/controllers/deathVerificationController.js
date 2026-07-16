const DeathVerification = require("../models/DeathVerification");
const Will = require("../models/Will");
const Notification = require("../models/Notification");

// Submit Death Verification Request
const submitVerificationRequest = async (req, res) => {
  try {
    const { willId, proofDocument } = req.body;

    const will = await Will.findById(willId);

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    const request = await DeathVerification.create({
      user: req.user.id,
      will: willId,
      proofDocument,
    });

    res.status(201).json({
      message: "Death verification request submitted",
      request,
    });

  } catch (error) {
    console.log("❌ DEATH VERIFICATION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Verification Requests
const getAllVerificationRequests = async (req, res) => {
  try {
    const requests = await DeathVerification.find()
      .populate("user", "name email")
      .populate("will", "title");

    res.status(200).json({
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.log("❌ GET REQUESTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve Verification Request
const approveVerificationRequest = async (req, res) => {
  try {
    const request = await DeathVerification.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Verification request not found",
      });
    }

    request.status = "Approved";
    request.verifiedBy = req.user.id;
    request.verifiedAt = new Date();

    await request.save();

    await Will.findByIdAndUpdate(request.will, {
      deathVerificationStatus: "Verified",
    });

    await Notification.create({
      user: request.user,
      title: "Death Verification Approved",
      message:
        "Your death verification request has been approved successfully.",
    });

    res.status(200).json({
      message: "Verification approved successfully",
      request,
    });

  } catch (error) {
    console.log("❌ APPROVAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  submitVerificationRequest,
  getAllVerificationRequests,
  approveVerificationRequest,
};