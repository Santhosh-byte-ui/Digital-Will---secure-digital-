const Will = require("../models/Will");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Create Will
const createWill = async (req, res) => {
  try {
    console.log("Mongoose State:", mongoose.connection.readyState);
    console.log("User:", req.user);

    const {
      title,
      assets,
      beneficiaries,
      instructions,
    } = req.body;

    const will = await Will.create({
      owner: req.user.id,
      title,
      assets,
      beneficiaries,
      instructions,
    });

    await Notification.create({
      user: req.user.id,
      title: "Will Created",
      message: `Your will "${title}" was created successfully.`,
    });

    res.status(201).json({
      message: "Will created successfully",
      will,
    });

  } catch (error) {
    console.log("❌ CREATE WILL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Wills
const getMyWills = async (req, res) => {
  try {
    const wills = await Will.find({
      owner: req.user.id,
    });

    res.status(200).json({
      count: wills.length,
      wills,
    });

  } catch (error) {
    console.log("❌ GET WILL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Will
const getWillById = async (req, res) => {
  try {
    const will = await Will.findById(req.params.id);

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    res.status(200).json(will);

  } catch (error) {
    console.log("❌ GET SINGLE WILL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Will
const updateWill = async (req, res) => {
  try {
    const will = await Will.findById(req.params.id);

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    const updatedWill = await Will.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Will updated successfully",
      will: updatedWill,
    });

  } catch (error) {
    console.log("❌ UPDATE WILL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Will
const deleteWill = async (req, res) => {
  try {
    const will = await Will.findById(req.params.id);

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    await Will.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Will deleted successfully",
    });

  } catch (error) {
    console.log("❌ DELETE WILL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createWill,
  getMyWills,
  getWillById,
  updateWill,
  deleteWill,
};