"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // If successful
      if (mode === "signup") {
        alert("Account created successfully! Please sign in.");
        setMode("login");
      } else {
        // Sign in successfully - update global state
        setAuthUser(data.user);
        
        if (data.isAdmin) {
          localStorage.setItem("nove_admin", JSON.stringify(data.user));
          router.push("/admin");
        } else {
          // Redirection on successful login
          router.push("/store");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center px-6">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/40 via-gray-200/10 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/50 via-gray-200/10 to-transparent"
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/" className="text-3xl font-serif text-[#1d1d1f] tracking-widest">NOVE</Link>
          <p className="text-gray-400 mt-2 font-light">The luxury you deserve.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[40px] p-10 shadow-[0_8px_60px_rgba(0,0,0,0.08)]"
        >
          {/* Tab Toggle */}
          <div className="flex bg-[#fbfbfd] rounded-2xl p-1 mb-8">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  setError("");
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === tab
                    ? "bg-white text-[#1d1d1f] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {mode === "signup" && (
                <div>
                  <label className="text-sm text-gray-500 font-medium block mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-[#fbfbfd] border border-gray-100 rounded-2xl px-5 py-4 pl-12 text-[#1d1d1f] placeholder:text-gray-300 focus:border-gray-300 focus:outline-none transition-colors"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <Mail size={18} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500 font-medium block mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#fbfbfd] border border-gray-100 rounded-2xl px-5 py-4 pl-12 text-[#1d1d1f] placeholder:text-gray-300 focus:border-gray-300 focus:outline-none transition-colors"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <Mail size={18} />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-500 font-medium">Password</label>
                  {mode === "login" && (
                    <Link href="#" className="text-xs text-gray-400 hover:text-[#1d1d1f] transition-colors">Forgot password?</Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full bg-[#fbfbfd] border border-gray-100 rounded-2xl px-5 py-4 pl-12 pr-12 text-[#1d1d1f] placeholder:text-gray-300 focus:border-gray-300 focus:outline-none transition-colors"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <Lock size={18} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-3 bg-[#1d1d1f] text-white py-5 rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all mt-2 group disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-sm text-gray-300 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-3 bg-[#fbfbfd] border border-gray-100 rounded-2xl py-4 text-[#1d1d1f] font-medium hover:border-gray-200 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </motion.div>

        <p className="text-center text-gray-400 text-sm mt-8">
          By continuing, you agree to NOVE&apos;s{" "}
          <Link href="#" className="underline hover:text-[#1d1d1f] transition-colors">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="underline hover:text-[#1d1d1f] transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
