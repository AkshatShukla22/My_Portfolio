// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  console.log('📧 Sending email...');
  console.log('Config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    passExists: !!process.env.EMAIL_PASS
  });

  // Create transporter using EMAIL_* variables (matching your .env)
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection
  await transporter.verify();

  // Send email
  const message = {
    from: `Portfolio <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  };

  return await transporter.sendMail(message);
};

export default sendEmail;