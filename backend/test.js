const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error(
    "MONGO_URI is missing. Check backend/.env or the environment configuration.",
  );
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected Successfully");
  } catch (error) {
    const code = error.code ? `, code ${error.code}` : "";
    console.error(`MongoDB ping failed (${error.name}${code}).`);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
