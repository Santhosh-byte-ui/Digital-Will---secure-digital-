const User = require("../models/User");

const deadManChecker = async () => {
  try {
    console.log("⏳ Running Dead Man Algorithm...");

    const users = await User.find({
      deadManEnabled: true,
      deathVerificationTriggered: false,
    });

    const today = new Date();

    for (const user of users) {
      const lastActive = new Date(user.lastActiveDate);

      const diffTime = today.getTime() - lastActive.getTime();

      const inactiveDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (inactiveDays >= user.inactivityDays) {
        user.deathVerificationTriggered = true;

        await user.save();
      }
    }
  } catch (error) {
    console.error(`Dead-man check failed (${error.name}).`);
  }
};

module.exports = deadManChecker;
