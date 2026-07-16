const User = require("../models/User");

const deadManChecker = async () => {
  try {
    console.log(
      "⏳ Running Dead Man Algorithm..."
    );

    const users = await User.find({
      deadManEnabled: true,
      deathVerificationTriggered: false,
    });

    const today = new Date();

    for (const user of users) {
      const lastActive = new Date(
        user.lastActiveDate
      );

      const diffTime =
        today.getTime() - lastActive.getTime();

      const inactiveDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
      );

      console.log(
        `${user.email} inactive for ${inactiveDays} days`
      );

      if (
        inactiveDays >= user.inactivityDays
      ) {
        console.log(
          `⚠️ Triggering Death Verification for ${user.email}`
        );

        user.deathVerificationTriggered = true;

        await user.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = deadManChecker;