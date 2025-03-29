import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "TON_EMAIL", pass: "TON_MDP" },
});

export async function sendEmail(recipient, subject, text) {
  const info = await transporter.sendMail({ from: "TON_EMAIL", to: recipient, subject, text });
  return info.messageId;
}
