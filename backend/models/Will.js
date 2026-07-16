const mongoose = require("mongoose");

const willSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    assets: [
      {
        assetName: String,
        assetType: String,
        value: Number,
      },
    ],

    beneficiaries: [
      {
        name: String,
        email: String,
        mobile: String,
        relation: String,
        sharePercentage: Number,
      },
    ],

    instructions: {
      type: String,
      default: "",
    },

    // Will Status Workflow
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Locked", "Executed"],
      default: "Draft",
    },

    // Death Verification
    deathVerificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Will", willSchema);