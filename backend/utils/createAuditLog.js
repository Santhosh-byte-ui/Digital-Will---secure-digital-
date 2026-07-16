const AuditLog = require("../models/AuditLog");

const createAuditLog = async (
  userId,
  action,
  module,
  details = ""
) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      module,
      details,
    });
  } catch (error) {
    console.log(
      "Audit Log Error:",
      error.message
    );
  }
};

module.exports = createAuditLog;