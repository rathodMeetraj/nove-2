"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-sm tracking-widest uppercase text-gray-400 font-semibold mb-4">Get in touch</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1d1d1f] mb-6">We&apos;d love to<br/>hear from you.</h1>
          <p className="text-xl text-gray-500 font-light">Whether it&apos;s a question, a compliment, or custom order enquiry — we&apos;re all ears.</p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8">Contact Details</h2>
            </div>

            {[
              { icon: Mail, label: "Email", value: "hello@nove.in", sub: "We reply within 24 hours." },
              { icon: Phone, label: "Phone", value: "+91 98765 43210", sub: "Mon–Sat, 10am–7pm IST" },
              { icon: MapPin, label: "Studio", value: "NOVE Studio, Vadodara", sub: "Gujarat, India 390 001" },
            ].map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5 bg-white rounded-[24px] p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="p-3 bg-[#fbfbfd] rounded-2xl">
                  <info.icon size={22} strokeWidth={1.5} className="text-[#1d1d1f]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">{info.label}</p>
                  <p className="text-[#1d1d1f] font-semibold text-lg">{info.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{info.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#1d1d1f] text-white rounded-[24px] p-6">
                <MessageCircle size={24} strokeWidth={1.5} className="mb-4 text-gray-400" />
                <p className="font-semibold mb-1">Live Chat</p>
                <p className="text-gray-400 text-sm">Chat with us on Instagram @nove.bags</p>
              </div>
              <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
                <Clock size={24} strokeWidth={1.5} className="mb-4 text-gray-400" />
                <p className="font-semibold text-[#1d1d1f] mb-1">Response Time</p>
                <p className="text-gray-400 text-sm">Usually within a few hours.</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-10 shadow-[0_4px_40px_rgba(0,0,0,0.06)]"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center mb-6">
                  <Send size={32} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-3">Message Sent!</h3>
                <p className="text-gray-500 font-light">We&apos;ll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-2">Send a Message</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 font-medium mb-2 block">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Your name"
                      className="w-full bg-[#fbfbfd] rounded-2xl px-5 py-4 text-[#1d1d1f] placeholder:text-gray-300 border border-gray-100 focus:border-gray-300 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium mb-2 block">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full bg-[#fbfbfd] rounded-2xl px-5 py-4 text-[#1d1d1f] placeholder:text-gray-300 border border-gray-100 focus:border-gray-300 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 font-medium mb-2 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full bg-[#fbfbfd] rounded-2xl px-5 py-4 text-[#1d1d1f] border border-gray-100 focus:border-gray-300 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Select a subject</option>
                    <option>Order Enquiry</option>
                    <option>Custom Order</option>
                    <option>Returns & Exchange</option>
                    <option>Wholesale / Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-500 font-medium mb-2 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Tell us how we can help…"
                    className="w-full bg-[#fbfbfd] rounded-2xl px-5 py-4 text-[#1d1d1f] placeholder:text-gray-300 border border-gray-100 focus:border-gray-300 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 bg-[#1d1d1f] text-white py-5 rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
