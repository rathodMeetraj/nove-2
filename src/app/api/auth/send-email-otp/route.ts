import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// A global storage for OTPs so they persist across API calls during development.
// In a real production environment, this should be Redis or a Database.
const globalAny: any = global;
if (!globalAny.otpStore) {
  globalAny.otpStore = {};
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a mathematically cryptographically secure 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in memory (expires in 5 minutes)
    globalAny.otpStore[email] = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // Configure Nodemailer with User's App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL || "YOUR_EMAIL_HERE@gmail.com",
        pass: process.env.SMTP_PASSWORD || "etzi okae nsxg uuxp",
      },
    });

    // Elegant HTML template for NOVE brand
    const mailOptions = {
      from: `"NOVE Authentication" <${process.env.SMTP_EMAIL || "no-reply@nove.in"}>`,
      to: email,
      subject: "Your NOVE Security Code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbfbfd; padding: 40px 0; display: flex; justify-content: center;">
          <div style="max-w-md: 400px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 40px rgba(0,0,0,0.05); text-align: center;">
            <h1 style="font-size: 24px; letter-spacing: 4px; font-weight: 300; color: #1d1d1f; margin-bottom: 8px;">NOVE</h1>
            <p style="color: #86868b; font-size: 14px; font-weight: 300; margin-bottom: 32px;">Secure checkout verification</p>
            
            <p style="color: #1d1d1f; font-size: 16px; margin-bottom: 24px;">Your authentication code is:</p>
            
            <div style="background-color: #f5f5f7; border-radius: 16px; padding: 20px; font-size: 32px; letter-spacing: 12px; font-weight: 500; color: #1d1d1f; margin-bottom: 32px;">
              ${otp}
            </div>
            
            <p style="color: #86868b; font-size: 12px; line-height: 1.6;">
              This code will expire in 5 minutes.<br>
              If you did not request this code, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`[AUTH] Sent OTP ${otp} to ${email}`);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP. Ensure SMTP credentials are correct." }, { status: 500 });
  }
}
