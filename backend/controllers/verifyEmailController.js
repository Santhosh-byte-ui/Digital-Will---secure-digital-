const User = require("../models/User");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("Received Token:", token);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: {
        $gt: Date.now(),
      },
    });

    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;

    await user.save();

    console.log("Email Verified Successfully");

    res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  verifyEmail,
};