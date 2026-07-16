const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const transporter = require("../config/email");

// ===============================
// Forgot Password
// ===============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save Token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Reset Link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password - Digital Will Management System",
      html: `
        <h2>Forgot Password</h2>

        <p>You requested to reset your password.</p>

        <p>Click the link below to reset your password:</p>

        <a href="${resetLink}">
          ${resetLink}
        </a>

        <p>This link will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent successfully.",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Reset Password
// ===============================
const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or Expired Reset Token",
      });
    }

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear Reset Token
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      message: "Password Reset Successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};