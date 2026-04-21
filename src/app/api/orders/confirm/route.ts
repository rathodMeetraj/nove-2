import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, orderDetails } = await request.json();

    if (!email || !orderDetails) {
      return NextResponse.json({ error: "Email and order details are required" }, { status: 400 });
    }

    // 1. Save to Supabase
    const orderId = `NOVE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        customer_email: email,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        total: orderDetails.total,
        items: orderDetails.items,
        shipping_address: orderDetails.shippingAddress,
        status: "Pending",
        payment_method: orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : "Online",
      })
      .select()
      .single();

    if (error || !order) {
      console.error("Supabase order insert error:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    // 2. Send Admin Notification Email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const itemsHtml = (order.items as Array<{ name: string; color: string; quantity: number; price: number }>)
        .map(
          (item) =>
            `<li>${item.name} (${item.color}) - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}</li>`
        )
        .join("");

      await transporter.sendMail({
        from: `"NOVE Sales System" <${process.env.SMTP_EMAIL}>`,
        to: process.env.SMTP_EMAIL, // Admin receives the notification
        subject: `New Order Received: ${order.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1a1a1a;">New Order Notification</h2>
            <p>A new purchase has been finalized on the NOVE platform.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Customer:</strong> ${email}</p>
              <p><strong>Payment Method:</strong> ${order.payment_method}</p>
              <p><strong>Total Amount:</strong> ₹${(order.total as number).toLocaleString()}</p>
            </div>

            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
            <ul>${itemsHtml}</ul>

            <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated notification from your enterprise sales system.</p>
          </div>
        `,
      });
      console.log(`[MAIL] Admin notification sent for order ${order.id}`);
    } catch (mailError) {
      console.error("[MAIL ERROR] Failed to send admin notification:", mailError);
    }

    console.log(`[ORDER] Recorded order ${order.id} for ${email}`);

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
