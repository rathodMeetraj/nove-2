"use client";

import { motion } from "framer-motion";
import { Truck, Globe, Box, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="bg-[#fbfbfd] min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-6">Concierge Shipping.</h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl">Ensuring your NOVE masterpiece reaches you with the same precision with which it was crafted.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1d1d1f] mb-6">
                <Truck size={24} />
             </div>
             <h3 className="text-xl font-semibold mb-4 text-[#1d1d1f]">Express Delivery</h3>
             <p className="text-gray-500 font-light leading-relaxed">Most domestic orders are delivered within 2-4 business days. We partner with premium logistics providers to ensure white-glove handling throughout the journey.</p>
          </div>
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1d1d1f] mb-6">
                <Globe size={24} />
             </div>
             <h3 className="text-xl font-semibold mb-4 text-[#1d1d1f]">Global Access</h3>
             <p className="text-gray-500 font-light leading-relaxed">International shipping is available to over 40 countries. Expect delivery within 6-10 days depending on your region and local customs processing.</p>
          </div>
        </div>

        <div className="space-y-16">
           <section>
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-6 flex items-center gap-3">
                 <Box size={20} className="text-gray-400" />
                 Museum-Grade Packaging
              </h2>
              <p className="text-gray-500 font-light leading-relaxed">
                 Every NOVE bag is shipped in our signature 'Museum Box' — an anti-static, shock-absorbent container designed to withstand the rigors of transit while maintaining its minimalist beauty. Our packaging is 100% plastic-free and recyclable.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-6 flex items-center gap-3">
                 <ShieldCheck size={20} className="text-gray-400" />
                 Fully Insured Transit
              </h2>
              <p className="text-gray-500 font-light leading-relaxed">
                 Your purchase is fully insured from the moment it leaves our studio until it is signed for by you. We require a signature for all deliveries to ensure your masterpiece arrives in the correct hands.
              </p>
           </section>

           <section className="bg-white border border-gray-100 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                 <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Need a status update?</h3>
                 <p className="text-gray-500 font-light">Track your artisan journey via your profile or email confirmation.</p>
              </div>
              <Link href="/profile" className="whitespace-nowrap bg-[#1d1d1f] text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                 Track My Order
              </Link>
           </section>
        </div>
      </div>
    </div>
  );
}
