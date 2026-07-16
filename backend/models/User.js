const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "nominee", "admin"],
      default: "owner",
    },

    // Emergency Contact
    emergencyContactName: {
      type: String,
      default: "",
    },

    emergencyContactMobile: {
      type: String,
      default: "",
    },

    // Forgot Password
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    // Email Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationTokenExpire: {
      type: Date,
      default: null,
    },

    // Dead Man's Algorithm
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },

    deadManEnabled: {
      type: Boolean,
      default: false,
    },

    inactivityDays: {
      type: Number,
      default: 30,
    },

    deathVerificationTriggered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);