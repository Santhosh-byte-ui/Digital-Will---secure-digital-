const User = require("../models/User");

const updateDeadManSettings = async (req, res) => {
  try {
    const { deadManEnabled, inactivityDays } = req.body;

    if (
      typeof deadManEnabled !== "boolean" ||
      !Number.isInteger(inactivityDays) ||
      inactivityDays < 1 ||
      inactivityDays > 3650
    ) {
      return res.status(400).json({
        message:
          "Provide a boolean enabled value and an inactivity period from 1 to 3650 days.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        deadManEnabled,
        inactivityDays,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select(
      "deadManEnabled inactivityDays lastActiveDate deathVerificationTriggered",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Dead Man Settings Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update dead-man settings.",
    });
  }
};

module.exports = {
  updateDeadManSettings,
};
