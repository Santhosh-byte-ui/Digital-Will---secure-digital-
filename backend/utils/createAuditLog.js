const mongoose = require("mongoose");
const AuditLog = require("../models/AuditLog");

/**
 * Creates an activity history / audit log entry.
 * Supports both object signature and positional arguments for backwards compatibility.
 *
 * Signature 1 (Object):
 * createAuditLog({
 *   userId,
 *   action,
 *   category,
 *   description,
 *   status,
 *   performedBy
 * })
 *
 * Signature 2 (Positional):
 * createAuditLog(userId, action, categoryOrModule, descriptionOrDetails, status, performedBy)
 */
const createAuditLog = async (
  arg1,
  actionArg,
  categoryArg,
  descriptionArg,
  statusArg = "success",
  performedByArg = null
) => {
  try {
    let payload = {};

    if (arg1 && typeof arg1 === "object" && !(arg1 instanceof mongoose.Types.ObjectId)) {
      const {
        userId,
        user,
        action,
        category,
        module: mod,
        description,
        details,
        status = "success",
        performedBy = null,
        timestamp = new Date(),
      } = arg1;

      const targetUser = userId || user;
      if (!targetUser || !mongoose.isValidObjectId(String(targetUser))) {
        return null;
      }

      let validPerformedBy = performedBy;
      if (validPerformedBy && !mongoose.isValidObjectId(String(validPerformedBy))) {
        validPerformedBy = null;
      }

      payload = {
        user: targetUser,
        userId: targetUser,
        action: action || "Unknown Action",
        category: category || mod || "General",
        module: mod || category || "General",
        description: description || details || "",
        details: details || description || "",
        status: ["success", "pending", "failed", "info"].includes(status) ? status : "success",
        performedBy: validPerformedBy || null,
        timestamp: timestamp || new Date(),
      };
    } else {
      const userId = arg1;
      if (!userId || !mongoose.isValidObjectId(String(userId))) {
        return null;
      }

      let validPerformedBy = performedByArg;
      if (validPerformedBy && !mongoose.isValidObjectId(String(validPerformedBy))) {
        validPerformedBy = null;
      }

      payload = {
        user: userId,
        userId: userId,
        action: actionArg || "General Action",
        category: categoryArg || "General",
        module: categoryArg || "General",
        description: descriptionArg || "",
        details: descriptionArg || "",
        status: ["success", "pending", "failed", "info"].includes(statusArg) ? statusArg : "success",
        performedBy: validPerformedBy || null,
        timestamp: new Date(),
      };
    }

    // Sanitize any potential sensitive information in descriptions
    if (typeof payload.description === "string") {
      payload.description = payload.description
        .replace(/password[:=]\s*[^\s,]+/gi, "password: [REDACTED]")
        .replace(/token[:=]\s*[^\s,]+/gi, "token: [REDACTED]")
        .replace(/secret[:=]\s*[^\s,]+/gi, "secret: [REDACTED]");
      payload.details = payload.description;
    }

    const logEntry = await AuditLog.create(payload);
    return logEntry;
  } catch (error) {
    // Non-blocking error handling to preserve core transaction
    console.error("[createAuditLog Error]:", error.message);
    return null;
  }
};

module.exports = createAuditLog;
