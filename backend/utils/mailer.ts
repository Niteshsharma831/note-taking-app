import nodemailer from "nodemailer";

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7faff;">
      <h2 style="text-align: center; color: #1a73e8; margin-bottom: 8px;">🔐 One-Time Passcode</h2>
      <p style="font-size: 16px; color: #333; text-align: center;">for accessing your Note App account</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; padding: 12px 24px; background: #fff; border: 1px dashed #1a73e8; border-radius: 8px; display: inline-block; letter-spacing: 4px; color: #1a73e8;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 15px; color: #555; text-align: center;">
        Enter this code in the app to verify your email. This code will expire in 5 minutes.
      </p>

      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
        Didn’t request this? Please ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} Note App — Simplify your thoughts.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Note App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code - Note App",
    html,
  });
};
