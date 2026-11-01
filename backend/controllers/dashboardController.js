const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const mongoose = require("mongoose");
const Asset = require("../models/Asset");
const Beneficiary = require("../models/Beneficiary");
const Will = require("../models/Will");
const Vault = require("../models/Vault");

const getDashboardStats = async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments({
      user: req.user.id,
    });

    const totalBeneficiaries = await Beneficiary.countDocuments({
      user: req.user.id,
    });

    const totalWills = await Will.countDocuments({
      owner: req.user.id,
    });

    const totalDocuments = await Vault.countDocuments({
      user: req.user.id,
    });

    const assets = await Asset.find({
      user: req.user.id,
    });

    const totalEstateValue = assets.reduce(
      (sum, asset) => sum + Number(asset.value || 0),
      0,
    );

    // Asset Distribution
    const assetDistribution = await Asset.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: "$assetType",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const chartData = assetDistribution.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // Monthly Upload Trend
    const uploadTrend = await Vault.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          uploads: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const uploadTrendData = uploadTrend.map((item) => ({
      month: monthNames[item._id.month],
      uploads: item.uploads,
    }));

    // Recent Activities
    const recentActivities = await AuditLog.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Dead Man Status
    const user = await User.findById(req.user.id).select(
      "deadManEnabled inactivityDays lastActiveDate deathVerificationTriggered",
    );

    res.status(200).json({
      totalAssets,
      totalBeneficiaries,
      totalWills,
      totalDocuments,
      totalEstateValue,
      assetDistribution: chartData,
      uploadTrend: uploadTrendData,
      recentActivities,
      deadManStatus: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load dashboard data.",
    });
  }
};

module.exports = {
  getDashboardStats,
};
