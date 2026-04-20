import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userOrders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders: userOrders
    });
  } catch (error: any) {
    console.error("Order history fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
