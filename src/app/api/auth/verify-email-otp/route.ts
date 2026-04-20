import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const globalAny: any = global;
    const storedData = globalAny.otpStore?.[email];

    // If no OTP was requested or code was never generated
    if (!storedData) {
      return NextResponse.json({ error: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
    }

    // Check if it's expired
    if (Date.now() > storedData.expiresAt) {
      delete globalAny.otpStore[email]; // clean up
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Verify the code
    if (storedData.code !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
    }

    // Success! Clean up the OTP so it can't be reused
    delete globalAny.otpStore[email];

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Server error during verification" }, { status: 500 });
  }
}
