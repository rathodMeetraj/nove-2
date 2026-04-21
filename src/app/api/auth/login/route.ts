import { NextResponse } from "next/server";
import crypto from "crypto";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
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
        message: "Admin access granted",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
    }

    let isValid = false;
    if (user.password && user.password.includes(":")) {
      const [salt, storedHash] = user.password.split(":");
      const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
      // Use constant-time comparison to prevent timing attacks
      isValid = crypto.timingSafeEqual(
        Buffer.from(storedHash, "hex"),
        Buffer.from(derivedKey, "hex")
      );
    } else {
      // Fallback for any old cleartext passwords during transition
      isValid = user.password === password;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password. Please try again." }, { status: 401 });
    }

    console.log(`[AUTH] User signed in: ${email}`);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
