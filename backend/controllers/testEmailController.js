const transporter = require("../config/email");

const sendTestEmail = async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Digital Will Management System",
      text: "🎉 Congratulations! Your email configuration is working successfully.",
    });

    res.json({
      message: "Test email sent successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendTestEmail,
};