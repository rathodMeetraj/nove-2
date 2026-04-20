"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
  }, [isOpen]);

  const results = query.trim() === "" 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#fbfbfd]/95 backdrop-blur-3xl flex flex-col p-6 md:p-12"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto w-full">
            <span className="font-serif text-2xl tracking-widest text-[#1d1d1f]">SEARCH</span>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            {/* Search Input */}
            <div className="relative mb-16">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={32} strokeWidth={1.5} />
              <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a masterpiece..."
                className="w-full bg-transparent border-b border-gray-200 py-6 pl-12 text-3xl md:text-5xl font-light placeholder:text-gray-200 focus:outline-none focus:border-[#1d1d1f] transition-colors"
              />
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {results.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        href={`/product/${product.id}`}
                        onClick={onClose}
                        className="group flex items-center space-x-6 bg-white rounded-3xl p-4 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all"
                      >
                        <div className="relative w-24 h-24 bg-[#fbfbfd] rounded-2xl p-2 flex-shrink-0">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-contain transition-transform group-hover:scale-110" 
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{product.collection}</p>
                          <h3 className="text-lg font-medium text-[#1d1d1f] mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-400">₹{product.price.toLocaleString()}</p>
                        </div>
                        <ArrowRight size={20} className="text-gray-200 group-hover:text-[#1d1d1f] transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {query.trim() !== "" && results.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <p className="text-2xl text-gray-300 font-light">No artifacts found matching your request.</p>
                </motion.div>
              )}

              {query.trim() === "" && (
                <div className="space-y-12">
                   <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6">Popular Searches</h4>
                      <div className="flex flex-wrap gap-3">
                         {['Terra', 'Midnight', 'Classic', 'Artisan'].map(tag => (
                           <button 
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-6 py-2 rounded-full border border-gray-100 text-sm text-gray-600 hover:border-[#1d1d1f] hover:text-[#1d1d1f] transition-all"
                           >
                            {tag}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-8 rounded-[32px] bg-white border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">New Arrivals</p>
                        <Link href="/store" onClick={onClose} className="text-lg font-medium flex items-center gap-2 group">
                          The Terra Series <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      <div className="p-8 rounded-[32px] bg-white border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Artisan Story</p>
                        <Link href="/about" onClick={onClose} className="text-lg font-medium flex items-center gap-2 group">
                          Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      <div className="p-8 rounded-[32px] bg-white border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Support</p>
                        <Link href="/contact" onClick={onClose} className="text-lg font-medium flex items-center gap-2 group">
                          Contact Us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
