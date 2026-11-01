const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

// Defensively normalize any environment variable keys and values that might have accidental whitespace
for (const key of Object.keys(process.env)) {
  const trimmedKey = key.trim();
  if (trimmedKey !== key) {
    if (process.env[trimmedKey] === undefined) {
      process.env[trimmedKey] = process.env[key];
    }
    delete process.env[key];
  }
}

for (const varName of [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_BUCKET_NAME",
  "MONGO_URI",
  "EMAIL",
  "FRONTEND_URL",
  "CORS_ORIGINS",
]) {
  if (typeof process.env[varName] === "string") {
    process.env[varName] = process.env[varName].trim();
  }
}

const validateEnvironment = require("./config/validateEnv");

try {
  validateEnvironment();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const cron = require("node-cron");
const deadManChecker = require("./utils/deadManChecker");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const multer = require("multer");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const deadManRoutes = require("./routes/deadManRoutes");
const assetRoutes = require("./routes/assetRoutes");
const willRoutes = require("./routes/willRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const beneficiaryPortalRoutes = require("./routes/beneficiaryPortalRoutes");
const vaultRoutes = require("./routes/vaultRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const deathVerificationRoutes = require("./routes/deathVerificationRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");
const verifyEmailRoutes = require("./routes/verifyEmailRoutes");

const app = express();

// Middleware
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(express.json({ limit: "1mb" }));

// ================= HEALTH & HOME ROUTE =================

app.get("/", (req, res) => {
  res.status(200).send("Digital Will Backend Server Running 🚀");
});

app.get("/api/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "UP" : "DOWN",
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/auth", verifyEmailRoutes);

app.use("/api/assets", assetRoutes);

app.use("/api/will", willRoutes);

app.use("/api/beneficiaries", beneficiaryRoutes);

app.use("/api/beneficiary-portal", beneficiaryPortalRoutes);

app.use("/api/vault", vaultRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/audit-logs", auditLogRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/death-verification", deathVerificationRoutes);

app.use("/api/deadman", deadManRoutes);

app.use("/api/pdf", pdfRoutes);

app.use("/api/test-email", testEmailRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res
      .status(status)
      .json({ message: "Uploaded file is invalid or exceeds limits." });
  }

  if (error.message === "Unsupported file type") {
    return res
      .status(400)
      .json({ message: "Only PDF, PNG, and JPEG files are accepted." });
  }

  if (error.type === "entity.too.large") {
    return res
      .status(413)
      .json({ message: "Request body exceeds the 1 MB limit." });
  }

  console.error(`Request failed (${error.name}).`);
  return res
    .status(500)
    .json({ message: "The request could not be completed." });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;
let httpServer;
let deadManTask;

const startServer = async () => {
  // Attempt to connect to MongoDB with up to 3 retries (5s interval).
await (async function connectWithRetry(retries = 3, delayMs = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await connectDB();
      // Successful connection, exit the retry loop.
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed.`);
      // Do not log the URI or credentials.
      console.error(err.message);
      if (attempt < retries) {
        console.log(`Waiting ${delayMs / 1000}s before next retry...`);
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        // All attempts failed – rethrow to abort startup.
        throw err;
      }
    }
  }
})();

  deadManTask = cron.schedule("0 0 * * *", async () => {
    console.log("⏳ Running Daily Dead Man Check...");
    await deadManChecker();
  });

  httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

const shutdown = (signal) => {
  console.log(`Received ${signal}; shutting down.`);
  deadManTask?.stop();

  const closeDatabase = async () => {
    await mongoose.disconnect();
    process.exitCode = 0;
  };

  if (!httpServer) {
    closeDatabase().catch(() => {
      process.exitCode = 1;
    });
    return;
  }

  const timeout = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10000);
  timeout.unref();

  httpServer.close(() => {
    closeDatabase()
      .catch(() => {
        process.exitCode = 1;
      })
      .finally(() => clearTimeout(timeout));
  });
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((err) => {
  console.error("Backend startup aborted; the server did not begin listening.");
  console.error(err);
  process.exitCode = 1;
  process.exit(1);
});
