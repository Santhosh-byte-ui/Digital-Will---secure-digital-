const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://vishalk24cy_db_user:Digital123@digitalwillcluster.gf7jzxl.mongodb.net/?retryWrites=true&w=majority&appName=DigitalWillCluster";

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
    console.log("✅ Connected Successfully!");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping Successful!");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run();