const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

auditLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
