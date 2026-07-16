const cron = require("node-cron");
const deadManChecker = require("./utils/deadManChecker");

const express = require("express");
const dns = require("dns");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const deadManRoutes = require("./routes/deadManRoutes");
const assetRoutes = require("./routes/assetRoutes");
const willRoutes = require("./routes/willRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const beneficiaryPortalRoutes = require("./routes/beneficiaryPortalRoutes");
const vaultRoutes = require("./routes/vaultRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const deathVerificationRoutes = require("./routes/deathVerificationRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const verifyEmailRoutes = require("./routes/verifyEmailRoutes");

const { ListBucketsCommand } = require("@aws-sdk/client-s3");
const s3 = require("./config/s3");


// Force Google DNS
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);


dotenv.config();


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);


// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.status(200).send(
    "Digital Will Backend Server Running 🚀"
  );
});


// ================= API ROUTES =================

app.use("/api/auth", authRoutes);

app.use(
  "/api/auth",
  forgotPasswordRoutes
);

app.use(
  "/api/auth",
  verifyEmailRoutes
);


app.use(
  "/api/assets",
  assetRoutes
);


app.use(
  "/api/will",
  willRoutes
);


app.use(
  "/api/beneficiaries",
  beneficiaryRoutes
);


app.use(
  "/api/beneficiary-portal",
  beneficiaryPortalRoutes
);


app.use(
  "/api/vault",
  vaultRoutes
);


app.use(
  "/api/dashboard",
  dashboardRoutes
);


app.use(
  "/api/audit-logs",
  auditLogRoutes
);


app.use(
  "/api/notifications",
  notificationRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/death-verification",
  deathVerificationRoutes
);


app.use(
  "/api/deadman",
  deadManRoutes
);


app.use(
  "/api/pdf",
  pdfRoutes
);


app.use(
  "/api/test-email",
  testEmailRoutes
);



// ================= AWS TEST =================

app.get(
  "/aws-test",
  async (req, res) => {

    try {

      const result =
        await s3.send(
          new ListBucketsCommand({})
        );


      res.json({
        success:true,
        buckets:result.Buckets,
      });


    } catch(error){

      console.log(error);


      res.status(500).json({
        success:false,
        error:error.message,
      });

    }

  }
);



// ================= DATABASE =================


console.log(
  "Mongo URI Loaded:",
  !!process.env.MONGO_URI
);


mongoose
.connect(
  process.env.MONGO_URI,
  {
    family:4,
    serverSelectionTimeoutMS:30000,
  }
)
.then(()=>{

  console.log(
    "✅ MongoDB Connected Successfully"
  );

})
.catch((err)=>{

  console.log(
    "❌ MongoDB Connection Failed!"
  );

  console.log(err);

});



// ================= DEAD MAN CRON =================


// Runs every day at midnight

cron.schedule(
  "0 0 * * *",
  async()=>{

    console.log(
      "⏳ Running Daily Dead Man Check..."
    );


    await deadManChecker();

  }
);



// ================= SERVER =================


const PORT =
process.env.PORT || 5000;


app.listen(
  PORT,
  ()=>{
    console.log(
      `Server is running on port ${PORT}`
    );
  }
);