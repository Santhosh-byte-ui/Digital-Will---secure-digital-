const User = require("../models/User");
const crypto = require("crypto");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: {
        $in: [token, crypto.createHash("sha256").update(token).digest("hex")],
      },
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Email verification failed. Please try again later.",
    });
  }
};

module.exports = {
  verifyEmail,
};
