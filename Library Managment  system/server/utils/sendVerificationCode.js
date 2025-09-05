// utils/sendVerificationCode.js
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmails.js";

export async function sendVerificationCode(verificationCode, email) {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Verification code (Bookworm Library Management System)",
      message,
    });

    return true;
  } catch (error) {
    throw new Error("Verification code failed to send");
  }
}
