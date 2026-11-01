const dns = require("dns");
const mongoose = require("mongoose");

// For mongodb+srv:// clusters, ensure public DNS resolvers can resolve SRV records if local router DNS fails
if (
  process.env.MONGO_URI &&
  process.env.MONGO_URI.startsWith("mongodb+srv://")
) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch {
    // Continue with default resolvers if environment restricts setServers
  }
}

mongoose.connection.on("error", (error) => {
  const code = error.code ? `, code ${error.code}` : "";
  console.error(`MongoDB connection error (${error.name}${code}).`);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected; Mongoose will attempt to reconnect.");
});

const logMongoConnectionFailure = (error) => {
  const code = error?.code ? `, code ${error.code}` : "";
  console.error(`MongoDB connection failed (${error?.name || "Error"}${code}).`);

  let isTlsAlert80 = false;
  if (error?.cause && typeof error.cause.message === "string") {
    if (error.cause.message.includes("alert number 80")) isTlsAlert80 = true;
  }
  if (!isTlsAlert80 && error?.reason?.servers) {
    for (const [, server] of error.reason.servers) {
      if (server?.error && typeof server.error.message === "string") {
        if (server.error.message.includes("alert number 80")) {
          isTlsAlert80 = true;
          break;
        }
      }
    }
  }

  if (isTlsAlert80) {
    console.error(
      "Atlas TLS Alert 80 (Internal Error): MongoDB Atlas rejected the connection because your IP address is not whitelisted.",
    );
    console.error(
      "Action required: Go to MongoDB Atlas -> Network Access -> Add IP Address -> 'Allow Access from Anywhere' (0.0.0.0/0) or add your current IP.",
    );
  } else {
    console.error(
      "Ensure your current IP is whitelisted under Atlas Network Access (0.0.0.0/0 for dev), and credentials are valid in backend/.env.",
    );
  }
};

let connectionPromise;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "MONGO_URI is missing. Check backend/.env or the environment configuration.",
    );
    throw new Error("MongoDB URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (mongoose.connection.readyState === 2) {
    connectionPromise = mongoose.connection
      .asPromise()
      .catch((error) => {
        logMongoConnectionFailure(error);
        throw error;
      })
      .finally(() => {
        connectionPromise = undefined;
      });

    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    })
    .then(() => {
      console.log("MongoDB connected successfully.");
    })
    .catch((error) => {
      logMongoConnectionFailure(error);
      throw error;
    })
    .finally(() => {
      connectionPromise = undefined;
    });

  return connectionPromise;
};

module.exports = connectDB;
