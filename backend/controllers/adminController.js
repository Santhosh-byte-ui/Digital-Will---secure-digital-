const User = require("../models/User");
const Asset = require("../models/Asset");
const Will = require("../models/Will");
const Vault = require("../models/Vault");
const DeathVerification =
  require("../models/DeathVerification");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const verifiedUsers =
      await User.countDocuments({
        isVerified: true,
      });

    const deadManEnabledUsers =
      await User.countDocuments({
        deadManEnabled: true,
      });

    const totalAssets =
      await Asset.countDocuments();

    const totalWills =
      await Will.countDocuments();

    const totalDocuments =
      await Vault.countDocuments();

    const totalRequests =
      await DeathVerification.countDocuments();

    const pendingRequests =
      await DeathVerification.countDocuments({
        status: "Pending",
      });

    const approvedRequests =
      await DeathVerification.countDocuments({
        status: "Approved",
      });

    const rejectedRequests =
      await DeathVerification.countDocuments({
        status: "Rejected",
      });

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalUsers,
      verifiedUsers,
      deadManEnabledUsers,
      totalAssets,
      totalWills,
      totalDocuments,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      users,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};