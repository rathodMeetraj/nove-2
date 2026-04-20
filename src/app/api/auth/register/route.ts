import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash the password with a randomly generated salt using scrypt
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    const hashedPassword = `${salt}:${derivedKey}`;

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log(`[AUTH] Registered new user: ${email}`);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
