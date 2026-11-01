const mongoose = require("mongoose");

const deathVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    will: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Will",
      required: true,
      index: true,
    },

    proofDocument: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    remarks: {
      type: String,
      default: "",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

deathVerificationSchema.index({ will: 1, status: 1 });

module.exports = mongoose.model("DeathVerification", deathVerificationSchema);
