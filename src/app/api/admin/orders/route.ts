import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();
    const allOrders = await Order.find().sort({ createdAt: -1 });
    
    // Calculate basic analytics
    const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + order.total, 0);
    const orderCount = allOrders.length;
    const codOrders = allOrders.filter((o: any) => o.paymentMethod === "Cash on Delivery").length;
    const onlineOrders = allOrders.filter((o: any) => o.paymentMethod === "Online").length;

    return NextResponse.json({
      success: true,
      orders: allOrders,
      stats: {
        totalRevenue,
        orderCount,
        codOrders,
        onlineOrders
      }
    });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
