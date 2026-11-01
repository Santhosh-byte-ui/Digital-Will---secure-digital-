const Notification = require("../models/Notification");

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load notifications.",
    });
  }
};

module.exports = {
  getNotifications,
};
