const User = require("../models/User");

const updateDeadManSettings = async (
  req,
  res
) => {
  try {
    const {
      deadManEnabled,
      inactivityDays,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        deadManEnabled,
        inactivityDays,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message:
        "Dead Man Settings Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateDeadManSettings,
};