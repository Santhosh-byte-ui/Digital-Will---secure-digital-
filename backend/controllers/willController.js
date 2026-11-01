const Will = require("../models/Will");
const Notification = require("../models/Notification");

// Create Will
const createWill = async (req, res) => {
  try {
    const { title, assets, beneficiaries, instructions } = req.body;

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
    console.error(`Will creation failed (${error.name}).`);
    res.status(500).json({
      message: "Could not create the will.",
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
    console.error(`Will list query failed (${error.name}).`);
    res.status(500).json({
      message: "Could not load wills.",
    });
  }
};

// Get Single Will
const getWillById = async (req, res) => {
  try {
    const will = await Will.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    res.status(200).json(will);
  } catch (error) {
    console.error(`Will lookup failed (${error.name}).`);
    res.status(500).json({
      message: "Could not load the will.",
    });
  }
};

// Update Will
const updateWill = async (req, res) => {
  try {
    const updates = {};
    for (const field of ["title", "assets", "beneficiaries", "instructions"]) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const updatedWill = await Will.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedWill) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    res.status(200).json({
      message: "Will updated successfully",
      will: updatedWill,
    });
  } catch (error) {
    console.error(`Will update failed (${error.name}).`);
    res.status(500).json({
      message: "Could not update the will.",
    });
  }
};

// Delete Will
const deleteWill = async (req, res) => {
  try {
    const will = await Will.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!will) {
      return res.status(404).json({ message: "Will not found" });
    }

    res.status(200).json({
      message: "Will deleted successfully",
    });
  } catch (error) {
    console.error(`Will deletion failed (${error.name}).`);
    res.status(500).json({
      message: "Could not delete the will.",
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
