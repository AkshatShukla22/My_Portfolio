// This handles both default and named exports
import pkg from 'nodemailer';
const nodemailer = pkg.default || pkg;

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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