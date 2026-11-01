const assert = require("node:assert/strict");
const test = require("node:test");
const mongoose = require("mongoose");

const AuditLog = require("../models/AuditLog");
const ActivityHistory = require("../models/ActivityHistory");
const createAuditLog = require("../utils/createAuditLog");
const {
  getAuditLogs,
  getAdminAuditLogs,
  getCategories,
} = require("../controllers/auditLogController");

const mockMethod = (t, target, name, implementation) => {
  const original = target[name];
  target[name] = implementation;
  t.after(() => {
    target[name] = original;
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
});

test("ActivityHistory and AuditLog refer to the same model and schema", () => {
  assert.equal(ActivityHistory, AuditLog);
});

test("createAuditLog sanitizes sensitive keywords and handles object signatures", async (t) => {
  let createdPayload = null;
  const dummyUserId = new mongoose.Types.ObjectId().toString();

  mockMethod(t, AuditLog, "create", async (payload) => {
    createdPayload = payload;
    return payload;
  });

  await createAuditLog({
    userId: dummyUserId,
    action: "Test Action",
    category: "Security",
    description: "User changed password=SuperSecret123 with token=abcdef123456",
    status: "success",
  });

  assert.ok(createdPayload);
  assert.equal(createdPayload.userId, dummyUserId);
  assert.equal(createdPayload.action, "Test Action");
  assert.equal(createdPayload.category, "Security");
  assert.match(createdPayload.description, /password: \[REDACTED\]/);
  assert.match(createdPayload.description, /token: \[REDACTED\]/);
  assert.equal(createdPayload.status, "success");
});

test("createAuditLog supports positional arguments for backward compatibility", async (t) => {
  let createdPayload = null;
  const dummyUserId = new mongoose.Types.ObjectId().toString();

  mockMethod(t, AuditLog, "create", async (payload) => {
    createdPayload = payload;
    return payload;
  });

  await createAuditLog(
    dummyUserId,
    "Positional Action",
    "Vault",
    "Uploaded secret=mySuperKey",
    "info"
  );

  assert.ok(createdPayload);
  assert.equal(createdPayload.userId, dummyUserId);
  assert.equal(createdPayload.action, "Positional Action");
  assert.equal(createdPayload.category, "Vault");
  assert.match(createdPayload.description, /secret: \[REDACTED\]/);
  assert.equal(createdPayload.status, "info");
});

test("getAuditLogs strictly enforces authenticated user scoping and supports pagination", async (t) => {
  const currentUserId = new mongoose.Types.ObjectId().toString();
  let queryCaptured = null;
  let skipCaptured = null;
  let limitCaptured = null;

  mockMethod(t, AuditLog, "countDocuments", async (filter) => {
    queryCaptured = filter;
    return 25;
  });

  mockMethod(t, AuditLog, "find", (filter) => {
    return {
      sort() {
        return {
          skip(s) {
            skipCaptured = s;
            return {
              limit(l) {
                limitCaptured = l;
                return {
                  async lean() {
                    return [
                      {
                        _id: new mongoose.Types.ObjectId(),
                        user: currentUserId,
                        action: "Will Created",
                        category: "Will Management",
                        description: "Created primary will",
                        status: "success",
                        createdAt: new Date(),
                      },
                    ];
                  },
                };
              },
            };
          },
        };
      },
    };
  });

  const req = {
    user: { id: currentUserId },
    query: {
      page: "2",
      limit: "10",
      category: "Will Management",
      status: "success",
    },
  };
  const res = response();

  await getAuditLogs(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.total, 25);
  assert.equal(res.body.page, 2);
  assert.equal(res.body.limit, 10);
  assert.equal(res.body.totalPages, 3);
  assert.equal(skipCaptured, 10);
  assert.equal(limitCaptured, 10);
  assert.equal(res.body.logs.length, 1);
  assert.equal(res.body.activities.length, 1);

  // Verify ownership constraint in query
  assert.ok(queryCaptured.$and);
  const ownershipClause = queryCaptured.$and.find((clause) =>
    Array.isArray(clause.$or) &&
    clause.$or.some((c) => c.user === currentUserId || c.userId === currentUserId)
  );
  assert.ok(ownershipClause, "Query must strictly scope to current user ID");
});

test("getAdminAuditLogs allows administrators to filter by target userId and returns populated data", async (t) => {
  const adminId = new mongoose.Types.ObjectId().toString();
  const targetUserId = new mongoose.Types.ObjectId().toString();
  let filterCaptured = null;

  mockMethod(t, AuditLog, "countDocuments", async (filter) => {
    filterCaptured = filter;
    return 1;
  });

  mockMethod(t, AuditLog, "find", (filter) => {
    return {
      populate() {
        return {
          populate() {
            return {
              sort() {
                return {
                  skip() {
                    return {
                      limit() {
                        return {
                          async lean() {
                            return [
                              {
                                _id: new mongoose.Types.ObjectId(),
                                user: { _id: targetUserId, name: "Target User", email: "target@example.com" },
                                performedBy: { _id: adminId, name: "Admin", email: "admin@example.com" },
                                action: "Verification Approved",
                                category: "Succession Verification",
                                description: "Approved verification",
                                status: "success",
                                createdAt: new Date(),
                              },
                            ];
                          },
                        };
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },
    };
  });

  const req = {
    user: { id: adminId, role: "admin" },
    query: {
      userId: targetUserId,
      category: "Succession Verification",
    },
  };
  const res = response();

  await getAdminAuditLogs(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.total, 1);
  assert.equal(res.body.logs[0].action, "Verification Approved");
  assert.ok(filterCaptured.$and.some((clause) =>
    Array.isArray(clause.$or) &&
    clause.$or.some((c) => c.user === targetUserId || c.userId === targetUserId)
  ));
});

test("getCategories returns distinct system and database categories", async (t) => {
  mockMethod(t, AuditLog, "distinct", async (field) => {
    if (field === "category") return ["Custom Category", "Vault"];
    return ["General"];
  });

  const req = { user: { id: "user-123" } };
  const res = response();

  await getCategories(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.categories.includes("Custom Category"));
  assert.ok(res.body.categories.includes("Authentication"));
  assert.ok(res.body.categories.includes("Will Management"));
});
