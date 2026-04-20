import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Default admin interceptor for unified login flow
    if (email === "admin@nove.in" && password === "admin123") {
      return NextResponse.json({
        success: true,
        user: { name: "NOVE Administrator", email: "admin@nove.in" },
        isAdmin: true,
        message: "Admin access granted"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
    }

    let isValid = false;
    if (user.password && user.password.includes(":")) {
      const [salt, storedHash] = user.password.split(":");
      const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
      // Use constant-time comparison to prevent timing attacks
      isValid = crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(derivedKey, "hex"));
    } else {
      // Fallback for any old cleartext passwords just in case during transition
      isValid = (user.password === password);
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password. Please try again." }, { status: 401 });
    }

    console.log(`[AUTH] User signed in: ${email}`);

    // Return the user data (excluding password)
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      message: "Signed in successfully"
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
