import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: "Order ID and new status are required" }, { status: 400 });
    }

    // 1. Update status in Supabase
    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    if (error || !updatedOrder) {
      console.error("Supabase status update error:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const customerEmail = updatedOrder.customer_email as string;
    console.log(`[STATUS UPDATE] Order ${orderId} updated to ${newStatus}`);

    // 2. Send Automated Status Update Email to Customer
    try {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      let statusDescription = "Your order status has been updated.";
      let statusHero = "Order Update";

      if (newStatus === "Processing") {
        statusHero = "Your Order is in the Atelier";
        statusDescription = "Our master artisans have begun meticulously crafting your selection. Each detail is being inspected for perfection.";
      } else if (newStatus === "Shipped") {
        statusHero = "Your Selection is En Route";
        statusDescription = "Your piece has departed the NOVE atelier and is now traveling to its new destination. Get ready to experience luxury.";
      } else if (newStatus === "Delivered") {
        statusHero = "Welcome to the World of NOVE";
        statusDescription = "Your artisan masterpiece has arrived. We hope it exceeds your every expectation.";
      }

      const itemsHtml = (updatedOrder.items as Array<{ name: string; color: string }>)
        .map((item) => `<li>${item.name} (${item.color})</li>`)
        .join("");

      await transporter.sendMail({
        from: `"NOVE Luxury" <${process.env.SMTP_EMAIL}>`,
        to: customerEmail,
        subject: `Order Update: ${updatedOrder.id} is now ${newStatus}`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #1a1a1a; color: #1a1a1a;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="letter-spacing: 0.2em; border-bottom: 2px solid #1a1a1a; display: inline-block; padding-bottom: 10px; margin: 0;">NOVE</h1>
            </div>
            
            <h2 style="font-weight: 300; font-size: 24px; text-align: center; margin-bottom: 30px;">${statusHero}</h2>
            
            <p style="line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
              Bonjour,<br><br>
              ${statusDescription}
            </p>

            <div style="background: #fdfdfd; padding: 30px; border: 1px solid #f0f0f0; margin-bottom: 40px;">
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; color: #888;">ORDER REFERENCE</p>
              <p style="margin: 0 0 20px 0; font-size: 18px; font-family: monospace;">${updatedOrder.id}</p>
              
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; color: #888;">NEW STATUS</p>
              <p style="margin: 0; font-size: 18px; color: #1a1a1a; font-weight: bold;">${newStatus.toUpperCase()}</p>
            </div>

            <div style="margin-bottom: 40px;">
               <h3 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Selections</h3>
               <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
            </div>

            <p style="font-size: 14px; color: #666; font-style: italic; text-align: center; margin-top: 40px;">
              Thank you for choosing NOVE.
            </p>
          </div>
        `,
      });
      console.log(`[STATUS MAIL] Notified ${customerEmail} of status: ${newStatus}`);
    } catch (mailError) {
      console.error("[STATUS MAIL ERROR] Failed to notify customer:", mailError);
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${newStatus} and customer notified.`,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
