import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  try {
    const { data: allOrders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase admin orders fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    const orders = allOrders ?? [];

    // Calculate basic analytics
    const totalRevenue = orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);
    const orderCount = orders.length;
    const codOrders = orders.filter((o: { payment_method: string }) => o.payment_method === "Cash on Delivery").length;
    const onlineOrders = orders.filter((o: { payment_method: string }) => o.payment_method === "Online").length;

    return NextResponse.json({
      success: true,
      orders,
      stats: {
        totalRevenue,
        orderCount,
        codOrders,
        onlineOrders,
      },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
