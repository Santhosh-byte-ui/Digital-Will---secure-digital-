const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://vishalk24cy_db_user:EP4YbsF8XqA9hBg1@digitalwillcluster.gf7jzxl.mongodb.net/?appName=DigitalWillCluster";

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
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();