const assert = require("node:assert/strict");
const test = require("node:test");

const Vault = require("../models/Vault");
const AuditLog = require("../models/AuditLog");
const s3 = require("../config/s3");
const {
  uploadFile,
  getFiles,
  viewFile,
  deleteFile,
} = require("../controllers/vaultController");

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

test("vault upload rejects missing files", async () => {
  const req = { user: { id: "user-123" } };
  const res = response();
  await uploadFile(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /No file uploaded/i);
});

test("vault upload rejects invalid file signatures even with valid extension", async () => {
  const req = {
    user: { id: "user-123" },
    file: {
      originalname: "fake.pdf",
      buffer: Buffer.from("plain text content, not a real pdf"),
      size: 32,
    },
  };
  const res = response();
  await uploadFile(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /Only valid PDF, PNG, and JPEG/i);
});

test("vault upload succeeds with valid PDF, sends to S3, and saves metadata in MongoDB", async (t) => {
  let s3SentCommand = null;
  let vaultSavedDoc = null;
  let auditLogDoc = null;

  mockMethod(t, s3, "send", async (command) => {
    s3SentCommand = command;
    return {};
  });

  mockMethod(t, Vault, "create", async (doc) => {
    vaultSavedDoc = { ...doc, _id: "vault-doc-id" };
    return vaultSavedDoc;
  });

  mockMethod(t, AuditLog, "create", async (entry) => {
    auditLogDoc = entry;
    return entry;
  });

  const validPdfBuffer = Buffer.concat([
    Buffer.from("%PDF-1.7\n"),
    Buffer.from("Valid PDF body content"),
  ]);

  const req = {
    user: { id: "user-456" },
    file: {
      originalname: "testament.pdf",
      buffer: validPdfBuffer,
      size: validPdfBuffer.length,
    },
  };
  const res = response();

  await uploadFile(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.message, "File uploaded successfully");
  assert.ok(res.body.file);
  assert.equal(vaultSavedDoc.fileName, "testament.pdf");
  assert.equal(vaultSavedDoc.user, "user-456");
  assert.equal(vaultSavedDoc.fileType, "application/pdf");
  assert.ok(vaultSavedDoc.filePath.startsWith("vault/user-456/"));
  assert.ok(s3SentCommand);
  assert.equal(s3SentCommand.input.Bucket, process.env.AWS_BUCKET_NAME);
  assert.equal(s3SentCommand.input.ContentType, "application/pdf");
});

test("vault upload cleans up S3 file if MongoDB saving fails after S3 upload", async (t) => {
  let deleteCommand = null;

  mockMethod(t, s3, "send", async (command) => {
    if (command.constructor.name === "DeleteObjectCommand") {
      deleteCommand = command;
      return {};
    }
    return {};
  });

  mockMethod(t, Vault, "create", async () => {
    throw new Error("Database connection dropped");
  });

  const validPdfBuffer = Buffer.from("%PDF-1.5 minimal valid pdf");
  const req = {
    user: { id: "user-789" },
    file: {
      originalname: "document.pdf",
      buffer: validPdfBuffer,
      size: validPdfBuffer.length,
    },
  };
  const res = response();

  await uploadFile(req, res);

  assert.equal(res.statusCode, 500);
  assert.ok(deleteCommand, "Orphaned S3 object should be cleaned up on DB failure");
});

test("vault upload handles S3 SignatureDoesNotMatch with descriptive safe error message", async (t) => {
  mockMethod(t, s3, "send", async () => {
    const err = new Error("The request signature we calculated does not match");
    err.name = "SignatureDoesNotMatch";
    throw err;
  });

  const validPdfBuffer = Buffer.from("%PDF-1.4 test");
  const req = {
    user: { id: "user-101" },
    file: {
      originalname: "will.pdf",
      buffer: validPdfBuffer,
      size: validPdfBuffer.length,
    },
  };
  const res = response();

  await uploadFile(req, res);

  assert.equal(res.statusCode, 500);
  assert.match(res.body.message, /SignatureDoesNotMatch/);
});

test("vault getFiles, viewFile, and deleteFile strictly scope access to the authenticated user", async (t) => {
  let findQuery = null;
  let findOneQuery = null;

  mockMethod(t, Vault, "find", (query) => {
    findQuery = query;
    return {
      sort() {
        return [{ _id: "doc-1", user: "owner-a" }];
      },
    };
  });

  mockMethod(t, Vault, "findOne", async (query) => {
    findOneQuery = query;
    return null; // Not found for this user
  });

  const reqA = { user: { id: "owner-a" } };
  const resList = response();
  await getFiles(reqA, resList);
  assert.equal(resList.statusCode, 200);
  assert.equal(findQuery.user, "owner-a");

  // User B tries to view or delete User A's document
  const reqB = { user: { id: "owner-b" }, params: { id: "doc-1" } };
  const resView = response();
  await viewFile(reqB, resView);
  assert.equal(resView.statusCode, 404);
  assert.equal(findOneQuery.user, "owner-b");
  assert.equal(findOneQuery._id, "doc-1");

  const resDelete = response();
  await deleteFile(reqB, resDelete);
  assert.equal(resDelete.statusCode, 404);
  assert.equal(findOneQuery.user, "owner-b");
});

