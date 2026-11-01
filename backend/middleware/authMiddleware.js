const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "name email role isVerified tokenVersion",
    );

    if (!user) {
      return res.status(401).json({ message: "Not authorized." });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Email verification is required." });
    }

    if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ message: "Authentication token is invalid or expired." });
    }

    console.error(`Authentication check failed (${error.name}).`);
    return res
      .status(500)
      .json({ message: "Authentication could not be verified." });
  }
};

const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized." });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to perform this action.",
        });
    }

    return next();
  };

module.exports = { protect, authorizeRoles };
