const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("🔥 JWT Middleware Running");

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

    console.log("✅ Token Verified:", decoded);

    // Fetch full user details from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    console.log("✅ Logged In User:", req.user);

    next();

  } catch (error) {
    console.log("❌ JWT Error:", error.message);

    res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

module.exports = { protect };