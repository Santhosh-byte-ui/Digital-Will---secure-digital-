const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Will = require("../models/Will");
const Asset = require("../models/Asset");
const Beneficiary = require("../models/Beneficiary");
const transporter = require("../config/email");
const authController = require("../controllers/authController");
const willController = require("../controllers/willController");
const pdfController = require("../controllers/pdfController");
const deathVerificationController = require("../controllers/deathVerificationController");
const verifyEmailController = require("../controllers/verifyEmailController");
const assetController = require("../controllers/assetController");
const beneficiaryController = require("../controllers/beneficiaryController");
const { authorizeRoles, protect } = require("../middleware/authMiddleware");
const validateEnvironment = require("../config/validateEnv");
const detectFileType = require("../utils/detectFileType");
const formatSafeMailError = require("../utils/formatSafeMailError");

const mockMethod = (t, target, name, implementation) => {
  const original = target[name];
  target[name] = implementation;
  t.after(() => {
    target[name] = original;
  });
};

const setEnv = (t, name, value) => {
  const original = process.env[name];
  process.env[name] = value;
  t.after(() => {
    if (original === undefined) delete process.env[name];
    else process.env[name] = original;
  });
};

const response = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
  end() {
    this.ended = true;
    return this;
  },
});

test("runtime config normalizes whitespace in variable names defensively", () => {
  assert.doesNotThrow(() =>
    validateEnvironment({
      " MONGO_URI": "placeholder-mongo-uri",
      " JWT_SECRET ": "x".repeat(32),
      " EMAIL": "sender@example.invalid",
      "EMAIL_PASSWORD ": "placeholder",
      EMAIL_SERVICE: "gmail",
      AWS_REGION: "test-region",
      AWS_BUCKET_NAME: "private-placeholder",
      NODE_ENV: "development",
    }),
  );
});
test("runtime config rejects missing security-critical settings", () => {
  assert.throws(() => validateEnvironment({}), /MONGO_URI/);
  assert.doesNotThrow(() =>
    validateEnvironment({
      MONGO_URI: "placeholder-mongo-uri",
      JWT_SECRET: "x".repeat(32),
      EMAIL: "sender@example.invalid",
      EMAIL_PASSWORD: "placeholder",
      EMAIL_SERVICE: "gmail",
      AWS_REGION: "test-region",
      AWS_BUCKET_NAME: "private-placeholder",
      NODE_ENV: "development",
    }),
  );
});

test("public registration ignores an attempted administrator role and auto-verifies", async (t) => {
  let created;
  mockMethod(t, User, "findOne", async () => null);
  mockMethod(t, User, "create", async (document) => {
    created = { ...document, _id: "isolated-user-id" };
    return created;
  });

  const res = response();
  await authController.registerUser(
    {
      body: {
        name: "Isolated Test",
        email: "TEST@example.invalid",
        password: "test-password-123",
        role: "admin",
      },
    },
    res,
  );

  assert.equal(res.statusCode, 201);
  assert.equal(created.role, "owner");
  assert.equal(created.email, "test@example.invalid");
  assert.equal(created.isVerified, true);
  assert.equal(res.body.message, "User registered successfully.");
});

test("login rejects missing users without issuing JWTs", async (t) => {
  mockMethod(t, User, "findOne", async () => null);
  const missingResponse = response();
  await authController.loginUser(
    { body: { email: "missing@example.invalid", password: "password123" } },
    missingResponse,
  );
  assert.equal(missingResponse.statusCode, 401);
  assert.equal(missingResponse.body.token, undefined);
});

test("verified login returns a usable seven-day token and safe user object", async (t) => {
  setEnv(t, "JWT_SECRET", "test-only-secret-which-is-at-least-32-bytes");
  const user = {
    _id: "isolated-user-id",
    name: "Test User",
    email: "user@example.invalid",
    role: "owner",
    tokenVersion: 0,
    isVerified: true,
    password: await bcrypt.hash("password123", 4),
    async save() {},
  };
  mockMethod(t, User, "findOne", async () => user);

  const res = response();
  await authController.loginUser(
    { body: { email: "USER@example.invalid", password: "password123" } },
    res,
  );

  assert.equal(res.statusCode, 200);
  assert.equal(jwt.verify(res.body.token, process.env.JWT_SECRET).id, user._id);
  assert.deepEqual(res.body.user, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

test("JWT middleware rejects missing, invalid, and expired tokens", async (t) => {
  const missingResponse = response();
  await protect({ headers: {} }, missingResponse, () =>
    assert.fail("next called"),
  );
  assert.equal(missingResponse.statusCode, 401);

  setEnv(t, "JWT_SECRET", "test-only-secret-which-is-at-least-32-bytes");
  const invalidResponse = response();
  await protect(
    { headers: { authorization: "Bearer invalid" } },
    invalidResponse,
    () => assert.fail("next called"),
  );
  assert.equal(invalidResponse.statusCode, 401);

  const expired = jwt.sign({ id: "isolated-user-id" }, process.env.JWT_SECRET, {
    expiresIn: -1,
  });
  const expiredResponse = response();
  await protect(
    { headers: { authorization: `Bearer ${expired}` } },
    expiredResponse,
    () => assert.fail("next called"),
  );
  assert.equal(expiredResponse.statusCode, 401);
});

test("JWT middleware rejects revoked token versions", async (t) => {
  setEnv(t, "JWT_SECRET", "test-only-secret-which-is-at-least-32-bytes");
  const token = jwt.sign(
    { id: "isolated-user-id", tokenVersion: 1 },
    process.env.JWT_SECRET,
  );
  mockMethod(t, User, "findById", () => ({
    select: async () => ({
      id: "isolated-user-id",
      isVerified: true,
      tokenVersion: 2,
      role: "owner",
    }),
  }));

  const res = response();
  await protect({ headers: { authorization: `Bearer ${token}` } }, res, () =>
    assert.fail("next called for a revoked token"),
  );
  assert.equal(res.statusCode, 401);
});

test("logout increments the server-side token version", async (t) => {
  let update;
  mockMethod(t, User, "updateOne", async (filter, changes) => {
    update = { filter, changes };
    return { modifiedCount: 1 };
  });

  const res = response();
  await authController.logoutUser({ user: { id: "isolated-user-id" } }, res);
  assert.equal(res.statusCode, 204);
  assert.deepEqual(update, {
    filter: { _id: "isolated-user-id" },
    changes: { $inc: { tokenVersion: 1 } },
  });
});

test("password recovery stores only a hash and reset accepts the one-time token", async (t) => {
  let mail;
  let saved = 0;
  const user = {
    name: "Test User",
    email: "user@example.invalid",
    resetPasswordToken: null,
    resetPasswordExpire: null,
    tokenVersion: 2,
    async save() {
      saved += 1;
    },
  };
  mockMethod(t, User, "findOne", async () => user);
  mockMethod(t, transporter, "sendMail", async (message) => {
    mail = message;
  });
  setEnv(t, "EMAIL", "sender@example.invalid");
  setEnv(t, "FRONTEND_URL", "https://frontend.example.invalid");

  const recoveryResponse = response();
  await authController.forgotPassword(
    { body: { email: user.email } },
    recoveryResponse,
  );
  assert.equal(recoveryResponse.statusCode, 200);
  assert.match(recoveryResponse.body.message, /If an eligible account exists/);
  const rawToken = mail.html.match(/reset-password\/([a-f0-9]{64})/)[1];
  assert.notEqual(user.resetPasswordToken, rawToken);
  assert.equal(
    user.resetPasswordToken,
    crypto.createHash("sha256").update(rawToken).digest("hex"),
  );

  const resetResponse = response();
  await authController.resetPassword(
    { params: { token: rawToken }, body: { password: "new-password-123" } },
    resetResponse,
  );
  assert.equal(resetResponse.statusCode, 200);
  assert.equal(user.resetPasswordToken, null);
  assert.equal(user.tokenVersion, 3);
  assert.equal(saved, 2);
});

test("email verification finds the hashed one-time token and clears it", async (t) => {
  const rawToken = "a".repeat(64);
  const user = {
    isVerified: false,
    verificationToken: crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex"),
    verificationTokenExpire: new Date(Date.now() + 60_000),
    async save() {},
  };
  let query;
  mockMethod(t, User, "findOne", async (filter) => {
    query = filter;
    return user;
  });

  const res = response();
  await verifyEmailController.verifyEmail({ params: { token: rawToken } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(user.isVerified, true);
  assert.equal(user.verificationToken, null);
  assert.ok(
    query.verificationToken.$in.includes(user.verificationToken) === false,
  );
  assert.ok(
    query.verificationToken.$in.includes(
      crypto.createHash("sha256").update(rawToken).digest("hex"),
    ),
  );
});

test("role middleware denies normal users and permits administrators", () => {
  const denied = response();
  authorizeRoles("admin")({ user: { role: "owner" } }, denied, () =>
    assert.fail("next called"),
  );
  assert.equal(denied.statusCode, 403);

  let nextCalled = false;
  authorizeRoles("admin")({ user: { role: "admin" } }, response(), () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
});

test("will, PDF, and verification handlers constrain records to the current owner", async (t) => {
  const userA = "owner-a-id";
  const willB = "will-owned-by-b";
  const filters = [];
  mockMethod(t, Will, "findOne", async (filter) => {
    filters.push(filter);
    return null;
  });
  mockMethod(t, Will, "findOneAndUpdate", async (filter, update) => {
    filters.push({ filter, update });
    return null;
  });
  mockMethod(t, Will, "findOneAndDelete", async (filter) => {
    filters.push(filter);
    return null;
  });

  const req = {
    user: { id: userA, email: "a@example.invalid" },
    params: { id: willB },
    body: { owner: "owner-b-id", deathVerificationStatus: "Verified" },
  };
  for (const handler of [
    willController.getWillById,
    pdfController.downloadWillPDF,
  ]) {
    const res = response();
    await handler(req, res);
    assert.equal(res.statusCode, 404);
  }

  const updateResponse = response();
  await willController.updateWill(req, updateResponse);
  assert.equal(updateResponse.statusCode, 404);

  const deleteResponse = response();
  await willController.deleteWill(req, deleteResponse);
  assert.equal(deleteResponse.statusCode, 404);

  assert.equal(filters[0].owner, userA);
  assert.equal(filters[1].$or[0].owner, userA);
  assert.equal(filters[2].filter.owner, userA);
  assert.deepEqual(Object.keys(filters[2].update.$set), []);
  assert.equal(filters[3].owner, userA);

  const verificationResponse = response();
  await deathVerificationController.submitVerificationRequest(
    {
      user: { id: userA },
      body: { willId: willB, proofDocument: "not-uploaded" },
    },
    verificationResponse,
  );
  assert.equal(verificationResponse.statusCode, 404);
  assert.equal(filters.at(-1).owner, userA);
});

test("asset and beneficiary updates scope IDs to the current user and whitelist fields", async (t) => {
  let assetQuery;
  let assetUpdate;
  let beneficiaryQuery;
  let beneficiaryUpdate;
  mockMethod(t, Asset, "findOneAndUpdate", async (query, update) => {
    assetQuery = query;
    assetUpdate = update;
    return null;
  });
  mockMethod(t, Beneficiary, "findOneAndUpdate", async (query, update) => {
    beneficiaryQuery = query;
    beneficiaryUpdate = update;
    return null;
  });

  const req = {
    user: { id: "owner-a-id" },
    params: { id: "record-owned-by-b" },
    body: {
      value: 100,
      user: "owner-b-id",
      owner: "owner-b-id",
      role: "admin",
    },
  };
  const assetResponse = response();
  await assetController.updateAsset(req, assetResponse);
  const beneficiaryResponse = response();
  await beneficiaryController.updateBeneficiary(req, beneficiaryResponse);

  assert.equal(assetResponse.statusCode, 404);
  assert.equal(beneficiaryResponse.statusCode, 404);
  assert.equal(assetQuery.user, req.user.id);
  assert.deepEqual(assetUpdate.$set, { value: 100 });
  assert.equal(beneficiaryQuery.user, req.user.id);
  assert.deepEqual(beneficiaryUpdate.$set, {});
});

test("file type detection uses signatures, not client MIME metadata", () => {
  assert.deepEqual(detectFileType(Buffer.from("%PDF-1.7")), {
    mime: "application/pdf",
    extension: "pdf",
  });
  assert.deepEqual(
    detectFileType(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    { mime: "image/png", extension: "png" },
  );
  assert.equal(detectFileType(Buffer.from("not a document")), null);
});

test("formatSafeMailError sanitizes error fields and formats diagnostic metadata", () => {
  const err = new Error("Connection failed");
  err.code = "EAUTH";
  err.command = "AUTH PLAIN";
  err.responseCode = 535;
  err.response = "535-5.7.8 Username and Password not accepted\r\n535 5.7.8 BadCredentials";

  const formatted = formatSafeMailError(err);
  assert.equal(
    formatted,
    'name: Error, code: EAUTH, command: AUTH PLAIN, responseCode: 535, response: "535-5.7.8 Username and Password not accepted 535 5.7.8 BadCredentials"',
  );

  assert.equal(formatSafeMailError(null), "Unknown error");
  assert.equal(formatSafeMailError("Plain string failure"), "Plain string failure");
});
