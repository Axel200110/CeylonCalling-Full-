// mailtrap/emails.js
import { transporter, sender } from "../config/email.config.js";

import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationToken) => {
  const info = await transporter.sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Verify your email",
    html: `<p>Your verification code is <b>${verificationToken}</b></p>`,
  });
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

export const sendWelcomeEmail = async (email, name) => {
  const info = await transporter.sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Welcome to Ceylon Calling!",
    html: `<p>Welcome, ${name}!</p><p>Your account is now verified.</p>`,
  });
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const info = await transporter.sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>Reset your password here: <a href="${resetURL}">${resetURL}</a></p>`,
  });
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

export const sendResetSuccessEmail = async (email) => {
  const info = await transporter.sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Password Reset Successful",
    html: `<p>Your password has been reset successfully.</p>`,
  });
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};
