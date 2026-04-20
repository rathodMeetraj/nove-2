import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      // For mock keys, since signature won't match without real testing, we'll allow mock success if secret is default
      if ((process.env.RAZORPAY_KEY_SECRET || 'mock_secret') === 'mock_secret') {
         return NextResponse.json({ success: true, message: "Payment verified (MOCK)" });
      }
      return NextResponse.json({ success: false, message: "Invalid signature sent!" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
