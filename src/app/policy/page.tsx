"use client";

import { motion } from "framer-motion";
import { Shield, RefreshCw, Lock, FileText } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="bg-[#fbfbfd] min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-6">Policies.</h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">Transparency and security are the foundations of the NOVE experience.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-20 text-left">
           <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <RefreshCw size={32} strokeWidth={1.5} className="text-[#1d1d1f] mb-6" />
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-4">Returns & Exchanges</h2>
              <p className="text-gray-500 font-light leading-relaxed mb-4">
                 We offer a 14-day complimentary returns policy for all unworn NOVE masterpieces. Items must be in their original packaging with the digital certificate unassigned.
              </p>
              <p className="text-gray-500 font-light leading-relaxed">
                 To initiate a return, visit your profile or contact our concierge team. Refunds are processed within 5-7 business days of quality inspection.
              </p>
           </section>

           <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <Lock size={32} strokeWidth={1.5} className="text-[#1d1d1f] mb-6" />
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-4">Privacy & Security</h2>
              <p className="text-gray-500 font-light leading-relaxed mb-4">
                 Your data is protected by 256-bit SSL encryption. We never share your personal information with third parties except to facilitate delivery.
              </p>
              <p className="text-gray-500 font-light leading-relaxed">
                 We collect only essential data: name, shipping destination, and transaction records to provide you with artisanal support and tracking.
              </p>
           </section>
        </div>

        <div className="bg-white border border-gray-100 rounded-[40px] p-12 space-y-12">
           <section>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                 <Shield size={18} className="text-gray-400" />
                 Authenticity Guarantee
              </h3>
              <p className="text-gray-500 font-light leading-relaxed">
                 Every NOVE bag is embedded with a secure NFC chip. This chip serves as your digital certificate of authenticity, verifying your product's origin and artisan history. Transfer of ownership can be managed via the NOVE app or web portal.
              </p>
           </section>

           <section>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                 <FileText size={18} className="text-gray-400" />
                 Terms of Service
              </h3>
              <p className="text-gray-500 font-light leading-relaxed">
                 By purchasing from NOVE, you agree to our terms regarding artisan lead times and handcrafted variation. Each bag is unique; small variations in texture and silhouette are hallmarks of the artisanal process and not defects.
              </p>
           </section>
        </div>

        <div className="mt-20 text-center">
           <p className="text-gray-400 text-sm">Last updated: April 16, 2026</p>
        </div>
      </div>
    </div>
  );
}
