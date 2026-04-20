import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay keys are set, use the live SDK
    if (keyId && keySecret && !keyId.includes('REPLACE')) {
      const Razorpay = (await import('razorpay')).default;
      const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await instance.orders.create({
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });
      return NextResponse.json(order);
    }

    // --- DEMO / TEST MODE ---
    // Returns a realistic mock order so the UI flow can be tested
    // without real Razorpay credentials
    const mockOrder = {
      id: `order_demo_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      status: "created",
      receipt: `rcpt_${Date.now()}`,
      _isDemoMode: true,
    };
    return NextResponse.json(mockOrder);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error("Order Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
