import nodemailer from 'nodemailer';

// Simple email sending utility
export const sendEmail = async ({ to, subject, message }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: message,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Generate reset password email HTML
export const getResetPasswordEmail = (resetLink) => {
  return `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
      Reset Password
    </a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
};

// Generate magic link email HTML
export const getMagicLinkEmail = (magicLink) => {
  return `
    <h2>Your Magic Login Link</h2>
    <p>Click the link below to login:</p>
    <a href="${magicLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
      Login Now
    </a>
    <p>This link will expire in 1 hour.</p>
  `;
};
