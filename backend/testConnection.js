const dns = require("dns");
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

if (
  process.env.MONGO_URI &&
  process.env.MONGO_URI.startsWith("mongodb+srv://")
) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch {}
}

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error(
    "MONGO_URI is missing. Check backend/.env or environment configuration.",
  );
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 8000,
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    const code = error.code ? `, code ${error.code}` : "";
    console.error(`MongoDB connection failed (${error.name}${code}).`);
    console.error(
      "If you see SSL/TLS alert errors or connection refused, ensure your current IP address is whitelisted in MongoDB Atlas under Network Access (e.g. 0.0.0.0/0 for development).",
    );
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
