const { rateLimit } = require("express-rate-limit");

const createLimiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message },
  });

const loginLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Try again later.",
);
const registrationLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many registration attempts. Try again later.",
);
const recoveryLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many recovery attempts. Try again later.",
);
const testEmailLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  "Too many test-email requests. Try again later.",
);

module.exports = {
  loginLimiter,
  registrationLimiter,
  recoveryLimiter,
  testEmailLimiter,
};
