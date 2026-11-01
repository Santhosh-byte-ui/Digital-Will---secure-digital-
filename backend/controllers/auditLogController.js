const AuditLog = require("../models/AuditLog");

// Get My Audit Logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load audit logs.",
    });
  }
};

module.exports = {
  getAuditLogs,
};
