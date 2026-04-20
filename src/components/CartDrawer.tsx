"use client";

import { useCart } from "./CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowRight, CheckCircle, ShieldCheck, CreditCard, Truck, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useAuth } from "./AuthProvider";

// Dynamically loads the Razorpay checkout script only when needed
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type AuthStep = "idle" | "email" | "otp";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  // Auth State (Legacy/COD email verification)
  const [authStep, setAuthStep] = useState<AuthStep>("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState("");

  // Shipping State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", pincode: "" });

  const recordOrder = async (orderEmail: string) => {
    try {
      await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: orderEmail,
          orderDetails: {
            total: cartTotal,
            items: items,
            paymentMethod: paymentMethod,
            shippingAddress: address
          }
        }),
      });
    } catch (err) {
      console.error("Failed to record order history:", err);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // First validate if we have address
    if (!address.street || !address.city || !address.pincode) {
      setShowAddressForm(true);
      return;
    }

    if (paymentMethod === "cod") {
      // Start Email Auth flow for COD
      setAuthStep("email");
      return;
    }

    // --- PAY ONLINE (RAZORPAY) ---
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const order = await res.json();

      if (!order.id) throw new Error("Order creation failed. Please try again.");

      if (order._isDemoMode) {
        await new Promise((r) => setTimeout(r, 1400));
        if (user) await recordOrder(user.email);
        setIsProcessing(false);
        setPaymentSuccess(true);
        if (clearCart) clearCart();
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment gateway failed to load. Check your internet connection.");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "NOVE Luxury",
        description: "Premium Handbag Collection",
        image: "/favicon.ico",
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const result = await verifyRes.json();
          if (result.success) {
            if (user) await recordOrder(user.email);
            setPaymentSuccess(true);
            if (clearCart) clearCart();
          }
          else alert("Payment verification failed. Please contact support@nove.in");
        },
        prefill: { name: user?.name || "", email: user?.email || "", contact: "" },
        theme: { color: "#1d1d1f" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout error occurred.";
      alert(msg);
      setIsProcessing(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setAuthError("Please enter a valid email.");
      return;
    }
    setAuthError("");
    setIsProcessing(true);
    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code.");

      setAuthStep("otp");
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setAuthError("Please enter the complete verification code.");
      return;
    }
    setAuthError("");
    setIsProcessing(true);
    try {
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");

      // Success! Record order to the logged-in user OR the verified email
      await recordOrder(user?.email || email);

      setAuthStep("idle");
      setPaymentSuccess(true);
      if (clearCart) clearCart();
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#161617]/95 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* ── Payment Success Overlay ── */}
            <AnimatePresence>
              {paymentSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-[#161617] z-30 flex flex-col items-center justify-center text-center p-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
                    className="mb-8"
                  >
                    <CheckCircle size={72} strokeWidth={1} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-light text-white mb-3 tracking-tight">Order Placed!</h2>
                  <p className="text-gray-400 font-light mb-8 leading-relaxed">
                    Welcome to the world of NOVE.<br />Your masterpiece is on its way.
                  </p>
                  
                  {paymentMethod === "cod" && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 w-full text-left flex items-start space-x-4">
                      <Truck size={24} className="text-white flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium mb-1">Cash on Delivery</h4>
                        <p className="text-sm text-gray-400 leading-snug">Please keep exact change ready. You will pay ₹{cartTotal.toLocaleString()} at the time of delivery.</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { setPaymentSuccess(false); setIsCartOpen(false); }}
                    className="px-10 py-4 bg-white text-[#161617] rounded-full font-medium hover:bg-gray-200 transition-colors w-full"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SHIPPING ADDRESS OVERLAY ── */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-[#161617] z-40 flex flex-col p-8"
                >
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10 pt-2">
                    <h2 className="text-xl font-light text-white tracking-widest uppercase">Delivery Details</h2>
                    <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-8">
                     <p className="text-gray-400 font-light text-sm leading-relaxed">
                        Where should we dispatch your NOVE artisan selections? Please provide a precise destination.
                     </p>

                     <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">Street Address / Apartment</label>
                        <input 
                          type="text"
                          placeholder="Ex: 123 Luxury Lane, Suite 402"
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:border-white focus:outline-none transition-colors"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">City</label>
                           <input 
                            type="text"
                            placeholder="MUMBAI"
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:border-white focus:outline-none transition-colors"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">Pincode</label>
                           <input 
                            type="text"
                            placeholder="400001"
                            maxLength={6}
                            value={address.pincode}
                            onChange={(e) => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:border-white focus:outline-none transition-colors tracking-[0.2em]"
                           />
                        </div>
                     </div>

                     <div className="pt-8">
                        <button
                          onClick={() => {
                            if (address.street && address.city && address.pincode.length >= 6) {
                              setShowAddressForm(false);
                            } else {
                              alert("Please complete every field accurately.");
                            }
                          }}
                          className="w-full bg-white text-[#161617] py-5 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                          Save & Continue to Payment
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── OTP AUTHENTICATION OVERLAY (COD ONLY) ── */}
            <AnimatePresence>
              {authStep !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0 bg-[#161617] z-20 flex flex-col p-6"
                >
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10 pt-2">
                    <h2 className="text-xl font-light text-white tracking-widest uppercase">Secure Verification</h2>
                    <button onClick={() => { setAuthStep("idle"); setAuthError(""); }} className="text-gray-400 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1">
                    {authError && <p className="text-red-400 text-sm mb-6 bg-red-400/10 p-4 rounded-xl">{authError}</p>}

                    {authStep === "email" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-gray-400 font-light mb-8 text-sm">
                          To place a Cash on Delivery order, we need to verify your email address. We will send a secure 6-digit code.
                        </p>
                        
                        <label className="text-sm text-gray-400 block mb-2 font-medium">Email Address</label>
                        <div className="relative mb-8">
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white placeholder:text-gray-600 focus:border-white focus:outline-none transition-colors"
                          />
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <button
                          onClick={handleSendOtp}
                          disabled={isProcessing}
                          className="w-full bg-white text-[#161617] py-4 rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? <span className="w-4 h-4 border-2 border-gray-400 border-t-[#161617] rounded-full animate-spin" /> : "Send Authentication Code"}
                        </button>
                      </motion.div>
                    )}

                    {authStep === "otp" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-gray-400 font-light mb-8 text-sm">
                          Enter the 6-digit code sent to <span className="text-white font-medium">{email}</span>.
                        </p>
                        
                        <label className="text-sm text-gray-400 block mb-2 font-medium">Authentication Code</label>
                        <div className="relative mb-8">
                          <input
                            type="text"
                            placeholder="• • • • • •"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white placeholder:text-gray-600 focus:border-white focus:outline-none transition-colors tracking-[0.5em] font-medium"
                          />
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <button
                          onClick={handleVerifyOtp}
                          disabled={isProcessing || otp.length < 4}
                          className="w-full bg-white text-[#161617] py-4 rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? <span className="w-4 h-4 border-2 border-gray-400 border-t-[#161617] rounded-full animate-spin" /> : "Verify & Place Order"}
                        </button>
                        
                        <button onClick={() => setAuthStep("email")} className="w-full text-center text-sm text-gray-500 mt-6 hover:text-white transition-colors">
                          Typo in email? Go back.
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-light text-white tracking-widest uppercase">Your Bag</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Cart Items ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="font-light tracking-wide">Your bag is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex space-x-4">
                    <div className="relative w-24 h-28 bg-white/5 rounded-2xl p-2 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-white font-light text-sm tracking-wide leading-snug">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id, item.color)}
                          className="text-gray-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{item.color}</p>
                      <div className="mt-auto flex justify-between items-center text-sm">
                        <span className="text-gray-400">Qty: {item.quantity}</span>
                        <span className="text-white font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ── Checkout Footer ── */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#161617]">
                
                {/* Payment Method Selector */}
                <div className="mb-6 space-y-3">
                  <button 
                    onClick={() => setPaymentMethod("online")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                      paymentMethod === "online" ? "border-white bg-white/10" : "border-white/15 bg-transparent hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard size={20} className={paymentMethod === "online" ? "text-white" : "text-gray-400"} />
                      <span className={`text-sm font-medium ${paymentMethod === "online" ? "text-white" : "text-gray-400"}`}>Pay Online (UPI/Cards)</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online" ? "border-white" : "border-gray-500"}`}>
                      {paymentMethod === "online" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                      paymentMethod === "cod" ? "border-white bg-white/10" : "border-white/15 bg-transparent hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck size={20} className={paymentMethod === "cod" ? "text-white" : "text-gray-400"} />
                      <span className={`text-sm font-medium ${paymentMethod === "cod" ? "text-white" : "text-gray-400"}`}>Cash on Delivery</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-white" : "border-gray-500"}`}>
                      {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                </div>

                <div className="flex justify-between text-white mb-6">
                  <span className="font-light text-gray-400">Total</span>
                  <span className="font-semibold text-xl">₹{cartTotal.toLocaleString()}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-white text-[#161617] py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors disabled:opacity-60 font-medium"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-[#161617] rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      {paymentMethod === "online" ? <ShieldCheck size={17} /> : <Truck size={17} />}
                      <span className="uppercase tracking-widest text-sm">
                        {paymentMethod === "online" ? "Secure Checkout" : "Continue to Verify"}
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-4">
                  {paymentMethod === "online" ? "256-bit SSL Encrypted · Powered by Razorpay" : "Identity verification required for COD"}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

