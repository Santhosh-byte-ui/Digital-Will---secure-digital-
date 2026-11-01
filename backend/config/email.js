const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  ...(process.env.EMAIL_SERVICE
    ? { service: process.env.EMAIL_SERVICE }
    : {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: process.env.EMAIL_SECURE === "true",
      }),
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;
