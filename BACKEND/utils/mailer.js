const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'fleetmanager@company.com',
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Alert email sent: ${subject}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
  }
};

module.exports = { sendAlertEmail };