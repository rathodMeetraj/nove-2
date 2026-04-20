"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function RecentlyViewed() {
  const [list, setList] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("nove_recently_viewed");
    if (saved) {
      try {
        setList(JSON.parse(saved));
      } catch (e) {
        setList([]);
      }
    }
  }, []);

  if (list.length === 0) return null;

  return (
    <section className="py-24 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-2">Recently Viewed.</h2>
        <p className="text-gray-500 mb-10">Continue where you left off.</p>

        <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {list.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 w-[200px] md:w-[240px]"
            >
              <Link href={`/product/${product.id}`} className="group">
                <div className="aspect-[4/5] bg-white rounded-3xl mb-4 overflow-hidden flex items-center justify-center p-6 border border-black/5 group-hover:shadow-lg transition-all">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    width={180} 
                    height={220} 
                    className="object-contain transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="text-[#1d1d1f] text-sm font-semibold truncate mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm">₹{product.price.toLocaleString()}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
