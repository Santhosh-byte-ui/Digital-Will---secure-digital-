const DeathVerification = require("../models/DeathVerification");
const Will = require("../models/Will");
const Notification = require("../models/Notification");
const createAuditLog = require("../utils/createAuditLog");

// Submit Death Verification Request
const submitVerificationRequest = async (req, res) => {
  try {
    const { willId, proofDocument } = req.body;

    const will = await Will.findOne({ _id: willId, owner: req.user.id });

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    if (will.deathVerificationStatus !== "Pending") {
      return res
        .status(409)
        .json({ message: "This will is not awaiting verification." });
    }

    const existingRequest = await DeathVerification.exists({
      will: willId,
      status: "Pending",
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "A verification request is already pending." });
    }

    const request = await DeathVerification.create({
      user: req.user.id,
      will: willId,
      proofDocument,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "Verification Submitted",
      category: "Succession Verification",
      description: `Submitted death verification request for will: "${will.title}"`,
      status: "pending",
    });

    res.status(201).json({
      message: "Death verification request submitted",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not submit the verification request.",
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
    res.status(500).json({
      message: "Could not load verification requests.",
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

    if (request.status !== "Pending") {
      return res
        .status(409)
        .json({ message: "Only pending requests can be approved." });
    }

    const will = await Will.findOne({
      _id: request.will,
      owner: request.user,
    });

    if (!will || will.deathVerificationStatus !== "Pending") {
      return res
        .status(409)
        .json({ message: "The request no longer matches a pending will." });
    }

    request.status = "Approved";
    request.verifiedBy = req.user.id;
    request.verifiedAt = new Date();

    await request.save();

    will.deathVerificationStatus = "Verified";
    will.verifiedAt = new Date();
    await will.save();

    await Notification.create({
      user: request.user,
      title: "Death Verification Approved",
      message:
        "Your death verification request has been approved successfully.",
    });

    await createAuditLog({
      userId: request.user,
      performedBy: req.user.id,
      action: "Verification Approved",
      category: "Succession Verification",
      description: `Death verification request approved by administrator for will: "${will.title}"`,
      status: "success",
    });

    res.status(200).json({
      message: "Verification approved successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not approve the verification request.",
    });
  }
};

const rejectVerificationRequest = async (req, res) => {
  try {
    const request = await DeathVerification.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ message: "Verification request not found" });
    }
    if (request.status !== "Pending") {
      return res
        .status(409)
        .json({ message: "Only pending requests can be rejected." });
    }

    const will = await Will.findOne({ _id: request.will, owner: request.user });
    if (!will || will.deathVerificationStatus !== "Pending") {
      return res
        .status(409)
        .json({ message: "The request no longer matches a pending will." });
    }

    request.status = "Rejected";
    request.verifiedBy = req.user.id;
    request.verifiedAt = new Date();
    await request.save();

    will.deathVerificationStatus = "Rejected";
    will.verifiedAt = new Date();
    await will.save();

    await Notification.create({
      user: request.user,
      title: "Death Verification Rejected",
      message: "Your death verification request was not approved.",
    });

    await createAuditLog({
      userId: request.user,
      performedBy: req.user.id,
      action: "Verification Rejected",
      category: "Succession Verification",
      description: `Death verification request rejected by administrator for will: "${will.title}"`,
      status: "failed",
    });

    return res
      .status(200)
      .json({ message: "Verification rejected successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not reject the verification request." });
  }
};

module.exports = {
  submitVerificationRequest,
  getAllVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
};
