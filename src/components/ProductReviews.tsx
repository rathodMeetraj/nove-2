"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

type Review = {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
};

const SEEDED_REVIEWS: Review[] = [
  {
    id: "1",
    user: "Aarya Sharma",
    rating: 5,
    date: "2 days ago",
    comment: "The glass-like finish is unlike anything I've seen before. It feels like holding a piece of future architecture. Absolutely stunning craftsmanship.",
    verified: true
  },
  {
    id: "2",
    user: "Vikram Mehta",
    rating: 5,
    date: "1 week ago",
    comment: "Bought the Midnight Black edition. The way it reflects light in the dark is mesmerizing. The sustainable eucalyptus leather is surprisingly soft and durable.",
    verified: true
  },
  {
    id: "3",
    user: "Sanya Roy",
    rating: 4,
    date: "2 weeks ago",
    comment: "Perfect weight and balance. It's more than a bag; it's a conversation starter. Shipping was fast and the packaging was completely plastic-free.",
    verified: true
  }
];

export default function ProductReviews() {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">Artisan Feedback</h2>
          <div className="flex items-center space-x-4">
            <div className="flex text-white">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-gray-400 font-light tracking-wide">4.9 / 5.0 based on 48 verified orders</span>
          </div>
        </div>
        
        <button className="px-8 py-3 rounded-full border border-white/10 text-white text-sm hover:bg-white hover:text-black transition-all font-medium uppercase tracking-widest">
          Share Your Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SEEDED_REVIEWS.map((review, idx) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-[32px] flex flex-col h-full hover:border-white/20 transition-colors group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex text-white/40 group-hover:text-white transition-colors">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{review.date}</span>
            </div>

            <p className="text-gray-300 font-light leading-relaxed mb-8 flex-grow italic">
              "{review.comment}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                  {review.user.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-white font-light">{review.user}</span>
              </div>
              {review.verified && (
                <div className="flex items-center space-x-1 text-[10px] text-gray-500 uppercase tracking-tighter">
                  <CheckCircle2 size={10} />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
