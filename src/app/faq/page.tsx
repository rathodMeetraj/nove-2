"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    question: "What makes NOVE bags different from traditional luxury brands?",
    answer: "NOVE focuses on 'Liquid Glass' aesthetics — a design philosophy where structure and fluidity meet. We use high-grade organic eucalyptus leather and innovative glass-derivative composites to create bags that are incredibly durable, sustainable, and lightweight."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, NOVE offers concierge shipping to over 40 countries. Delivery times vary between 4-10 business days for international orders, with all taxes and duties prepaid for a seamless experience."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 14-day complimentary returns policy for all unworn masterpieces in their original packaging. Each bag comes with a digital authenticity certificate which must remain unassigned for the return to be processed."
  },
  {
    question: "Is the eucalyptus leather real leather?",
    answer: "It is a bio-based, vegan alternative that outperforms traditional leather in durability and weight-to-strength ratio. It is 100% cruelty-free and crafted from sustainably harvested eucalyptus fibers."
  },
  {
    question: "How do I care for my NOVE bag?",
    answer: "Our composite finishes are highly resistant. For daily care, simply wipe with the microfiber cloth included in your museum box. Avoid prolonged exposure to direct high heat or sharp abrasive surfaces."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#fbfbfd] min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-6">FAQ.</h1>
          <p className="text-lg text-gray-500 font-light">Everything you need to know about the NOVE world.</p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] border border-gray-100 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-8 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-medium text-[#1d1d1f] group-hover:text-gray-500 transition-colors">{faq.question}</span>
                <div className={`p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#1d1d1f] group-hover:text-white transition-all ${openIndex === idx ? 'rotate-45' : ''}`}>
                  <Plus size={20} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-gray-500 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-12 rounded-[48px] bg-[#1d1d1f] text-white text-center flex flex-col items-center"
        >
           <MessageCircle size={40} strokeWidth={1} className="mb-6 opacity-50" />
           <h2 className="text-2xl font-serif mb-4">Still have questions?</h2>
           <p className="text-gray-400 font-light mb-8 max-w-sm">Our concierge team is available to assist you with any inquiries regarding our collections.</p>
           <Link href="/contact" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Contact Support
           </Link>
        </motion.div>
      </div>
    </div>
  );
}
