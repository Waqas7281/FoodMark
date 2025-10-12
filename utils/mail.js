const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_Admin, // generated ethereal user
    pass: process.env.PASSWORD_Admin, // generated ethereal password
  },
});

const sendMail = async (to, otp) => {
   await transporter.sendMail({
     from: `FoodCover <${process.env.EMAIL_Admin}>`, // sender address
     to: to,
     subject: "Reset Password", // Subject // plain‑text body
     html: `<p>Your OTP for password reset is <b>${otp}</b> It expires in 5 minutes</p>`, // HTML body
   });
};

module.exports = sendMail;
