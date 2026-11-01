const AuditLog = require("../models/AuditLog");

// Standard predefined categories to guarantee clean filter options
const DEFAULT_CATEGORIES = [
  "Authentication",
  "Will Management",
  "Asset Management",
  "Beneficiary Management",
  "Vault",
  "Succession Verification",
  "Security",
  "Admin Actions",
];

/**
 * Builds a Mongo filter query from request query parameters.
 */
const buildAuditFilter = (queryParams) => {
  const filter = {};
  const { category, module: mod, status, startDate, endDate, search, q } = queryParams;

  // Category or Module filter
  const targetCategory = category || mod;
  if (targetCategory && targetCategory !== "All" && targetCategory !== "all") {
    const escaped = targetCategory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { category: new RegExp(`^${escaped}$`, "i") },
      { module: new RegExp(`^${escaped}$`, "i") },
    ];
  }

  // Status filter
  if (status && status !== "All" && status !== "all") {
    filter.status = status.toLowerCase();
  }

  // Date range filter
  if (startDate || endDate) {
    const dateQuery = {};
    if (startDate) {
      const parsedStart = new Date(startDate);
      if (!isNaN(parsedStart.getTime())) {
        dateQuery.$gte = parsedStart;
      }
    }
    if (endDate) {
      const parsedEnd = new Date(endDate);
      if (!isNaN(parsedEnd.getTime())) {
        // Extend to end of day if only YYYY-MM-DD was provided
        if (endDate.length <= 10) {
          parsedEnd.setHours(23, 59, 59, 999);
        }
        dateQuery.$lte = parsedEnd;
      }
    }

    if (Object.keys(dateQuery).length > 0) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { timestamp: dateQuery },
          { createdAt: dateQuery },
        ],
      });
    }
  }

  // Free-text search filter across action and description/details
  const searchTerm = search || q;
  if (searchTerm && typeof searchTerm === "string" && searchTerm.trim()) {
    const escapedSearch = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearch, "i");
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { action: searchRegex },
        { description: searchRegex },
        { details: searchRegex },
      ],
    });
  }

  return filter;
};

// Get My Audit Logs (Authenticated User only)
const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const baseFilter = buildAuditFilter(req.query);

    // Enforce strict ownership: user can only see their own activity history
    const userFilter = {
      $and: [
        {
          $or: [{ user: req.user.id }, { userId: req.user.id }],
        },
      ],
    };

    if (baseFilter.$or) {
      userFilter.$and.push({ $or: baseFilter.$or });
      delete baseFilter.$or;
    }

    if (baseFilter.$and) {
      userFilter.$and.push(...baseFilter.$and);
      delete baseFilter.$and;
    }

    Object.assign(userFilter, baseFilter);

    const [total, rawLogs] = await Promise.all([
      AuditLog.countDocuments(userFilter),
      AuditLog.find(userFilter)
        .sort({ timestamp: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedLogs = rawLogs.map((log) => ({
      _id: log._id,
      id: log._id,
      user: log.user || log.userId,
      userId: log.userId || log.user,
      action: log.action,
      category: log.category || log.module || "General",
      module: log.module || log.category || "General",
      description: log.description || log.details || "",
      details: log.details || log.description || "",
      status: log.status || "success",
      performedBy: log.performedBy || null,
      timestamp: log.timestamp || log.createdAt || new Date(),
      createdAt: log.createdAt || log.timestamp || new Date(),
    }));

    res.status(200).json({
      success: true,
      count: total,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      logs: formattedLogs,
      activities: formattedLogs,
    });
  } catch (error) {
    console.error("[getAuditLogs Error]:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not load activity history.",
    });
  }
};

// Get All Audit Logs (Administrator only)
const getAdminAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = buildAuditFilter(req.query);

    // Optional user-specific filtering by administrator
    const targetUserId = req.query.userId || req.query.user;
    if (targetUserId) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ user: targetUserId }, { userId: targetUserId }],
      });
    }

    const [total, rawLogs] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter)
        .populate("user", "name email role")
        .populate("performedBy", "name email role")
        .sort({ timestamp: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedLogs = rawLogs.map((log) => ({
      _id: log._id,
      id: log._id,
      user: log.user || log.userId,
      userId: log.userId || log.user,
      action: log.action,
      category: log.category || log.module || "General",
      module: log.module || log.category || "General",
      description: log.description || log.details || "",
      details: log.details || log.description || "",
      status: log.status || "success",
      performedBy: log.performedBy || null,
      timestamp: log.timestamp || log.createdAt || new Date(),
      createdAt: log.createdAt || log.timestamp || new Date(),
    }));

    res.status(200).json({
      success: true,
      count: total,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      logs: formattedLogs,
      activities: formattedLogs,
    });
  } catch (error) {
    console.error("[getAdminAuditLogs Error]:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not load administrator activity logs.",
    });
  }
};

// Get distinct activity categories
const getCategories = async (req, res) => {
  try {
    const [dbCategories, dbModules] = await Promise.all([
      AuditLog.distinct("category"),
      AuditLog.distinct("module"),
    ]);

    const categorySet = new Set(DEFAULT_CATEGORIES);
    for (const cat of dbCategories) {
      if (cat && typeof cat === "string" && cat.trim()) {
        categorySet.add(cat.trim());
      }
    }
    for (const mod of dbModules) {
      if (mod && typeof mod === "string" && mod.trim()) {
        categorySet.add(mod.trim());
      }
    }

    res.status(200).json({
      success: true,
      categories: Array.from(categorySet),
    });
  } catch (error) {
    console.error("[getCategories Error]:", error.message);
    res.status(200).json({
      success: true,
      categories: DEFAULT_CATEGORIES,
    });
  }
};

module.exports = {
  getAuditLogs,
  getAdminAuditLogs,
  getCategories,
};
