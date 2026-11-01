const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/email");
const formatSafeMailError = require("../utils/formatSafeMailError");

const normalizeEmail = (email) => email.trim().toLowerCase();
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const frontendUrl = () =>
  (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Provide a name, valid email, and password of at least 8 characters.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user as automatically verified – no email verification required
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "owner",
      isVerified: true,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Email verification check removed – users can log in immediately

    user.lastActiveDate = Date.now();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        tokenVersion: user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed. Please try again later.",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Logout could not be completed." });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role isVerified emergencyContactName emergencyContactMobile",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load the profile.",
    });
  }
};

// Update Emergency Contact
const updateEmergencyContact = async (req, res) => {
  try {
    const { emergencyContactName, emergencyContactMobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        emergencyContactName,
        emergencyContactMobile,
      },
      {
        new: true,
      },
    ).select(
      "name email role isVerified emergencyContactName emergencyContactMobile",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Emergency contact updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update the emergency contact.",
    });
  }
};
// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (
      typeof email === "string" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      const user = await User.findOne({ email: normalizeEmail(email) });

      if (user) {
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = hashToken(resetToken);
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const resetLink = `${frontendUrl()}/reset-password/${resetToken}`;

        try {
          await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Reset Password - Digital Will Management System",
            html: `<p>Hello ${escapeHtml(user.name)},</p><p><a href="${resetLink}">Reset your password</a></p><p>This link expires in 10 minutes.</p>`,
          });
        } catch (error) {
          user.resetPasswordToken = null;
          user.resetPasswordExpire = null;
          await user.save();
          console.error(
            `Password recovery email delivery failed (${formatSafeMailError(error)}).`,
          );
        }
      }
    }

    res.status(200).json({
      message:
        "If an eligible account exists, password recovery instructions will be sent.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Password recovery is temporarily unavailable.",
    });
  }
};
// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: { $in: [token, hashToken(token)] },
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Password reset failed. Please try again later.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateEmergencyContact,
  forgotPassword,
  resetPassword,
};
