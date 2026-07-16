const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/email");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Verification Token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,

      verificationToken,
      verificationTokenExpire: Date.now() + 10 * 60 * 1000,
    });

    // Verification Link
    const verificationLink =
      `http://localhost:5173/verify-email/${verificationToken}`;


    // Send Verification Email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verify Your Email - Digital Will Management System",

      html: `
        <h2>Email Verification</h2>

        <p>Hello ${user.name},</p>

        <p>
          Thank you for registering with Digital Will Management System.
        </p>

        <p>
          Click the link below to verify your email:
        </p>

        <a href="${verificationLink}">
          ${verificationLink}
        </a>

        <p>
          This link expires in 10 minutes.
        </p>
      `,
    });


    res.status(201).json({
      message:
        "User registered successfully. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
   // Update Last Active Date
    user.lastActiveDate = Date.now();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
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
      message: error.message,
    });
  }
};


// Get Profile
const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");


    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// Update Emergency Contact
const updateEmergencyContact = async (req, res) => {
  try {

    const {
      emergencyContactName,
      emergencyContactMobile,
    } = req.body;


    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        emergencyContactName,
        emergencyContactMobile,
      },
      {
        new: true,
      }
    ).select("-password");


    res.status(200).json({
      message:
        "Emergency contact updated successfully",
      user,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password - Digital Will Management System",

      html: `
        <h2>Reset Password</h2>

        <p>Hello ${user.name},</p>

        <p>
          Click the link below to reset your password:
        </p>

        <a href="${resetLink}">
          ${resetLink}
        </a>

        <p>
          This link expires in 10 minutes.
        </p>
      `,
    });

    res.status(200).json({
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateEmergencyContact,
  forgotPassword,
  resetPassword,
};