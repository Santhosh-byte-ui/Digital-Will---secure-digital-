const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assetName: {
      type: String,
      required: true,
    },

    assetType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Asset", assetSchema);
