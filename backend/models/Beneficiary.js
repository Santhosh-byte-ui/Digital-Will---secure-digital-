const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    relationship: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    sharePercentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);