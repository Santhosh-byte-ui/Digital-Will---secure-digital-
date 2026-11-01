/**
 * Validates backend runtime configuration.
 *
 * Mandatory variables:
 * - MONGO_URI: MongoDB connection string
 * - JWT_SECRET: Cryptographic secret key (at least 32 characters)
 * - EMAIL & EMAIL_PASSWORD: SMTP sender credentials for verification and recovery
 * - EMAIL_SERVICE or EMAIL_HOST: Transport mechanism for Nodemailer
 * - AWS_REGION & AWS_BUCKET_NAME: S3 parameters for the digital document vault
 *
 * Production-only mandatory variables:
 * - FRONTEND_URL & CORS_ORIGINS: Domain whitelists for browser cross-origin requests
 */
const validateEnvironment = (env = process.env) => {
  // Normalize variable names defensively in case of leading/trailing whitespace
  const normalizedEnv = {};
  for (const [key, value] of Object.entries(env)) {
    if (typeof key === "string") {
      normalizedEnv[key.trim()] = value;
    }
  }

  const missing = ["MONGO_URI", "EMAIL", "EMAIL_PASSWORD"].filter(
    (name) => !normalizedEnv[name],
  );

  if (!normalizedEnv.EMAIL_SERVICE && !normalizedEnv.EMAIL_HOST) {
    missing.push("EMAIL_SERVICE or EMAIL_HOST");
  }

  if (
    !normalizedEnv.JWT_SECRET ||
    typeof normalizedEnv.JWT_SECRET !== "string" ||
    normalizedEnv.JWT_SECRET.length < 32
  ) {
    missing.push("JWT_SECRET (at least 32 characters)");
  }

  if (!normalizedEnv.AWS_REGION) {
    missing.push("AWS_REGION");
  }

  if (!normalizedEnv.AWS_BUCKET_NAME) {
    missing.push("AWS_BUCKET_NAME");
  }

  if (normalizedEnv.NODE_ENV === "production" && !normalizedEnv.FRONTEND_URL) {
    missing.push("FRONTEND_URL");
  }

  if (normalizedEnv.NODE_ENV === "production" && !normalizedEnv.CORS_ORIGINS) {
    missing.push("CORS_ORIGINS");
  }

  if (missing.length) {
    throw new Error(
      `Missing or invalid required configuration: ${missing.join(", ")}`,
    );
  }
};

module.exports = validateEnvironment;
