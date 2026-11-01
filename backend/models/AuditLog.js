const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: function () {
        return this.module || "General";
      },
      index: true,
    },

    module: {
      type: String,
      trim: true,
      default: function () {
        return this.category || "General";
      },
    },

    description: {
      type: String,
      trim: true,
      default: function () {
        return this.details || "";
      },
    },

    details: {
      type: String,
      trim: true,
      default: function () {
        return this.description || "";
      },
    },

    status: {
      type: String,
      enum: ["success", "pending", "failed", "info"],
      default: "success",
      index: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save synchronization hook between legacy and modern field names
auditLogSchema.pre("save", function (next) {
  if (!this.userId && this.user) {
    this.userId = this.user;
  }
  if (!this.user && this.userId) {
    this.user = this.userId;
  }
  if (!this.category && this.module) {
    this.category = this.module;
  }
  if (!this.module && this.category) {
    this.module = this.category;
  }
  if (!this.description && this.details) {
    this.description = this.details;
  }
  if (!this.details && this.description) {
    this.details = this.description;
  }
  if (!this.timestamp) {
    this.timestamp = this.createdAt || new Date();
  }
  next();
});

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, timestamp: -1 });

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
