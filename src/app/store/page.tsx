"use client";

import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function Store() {
  return (
    <div className="flex flex-col bg-[#fbfbfd] min-h-screen pt-24">
      {/* Product Grid Section - Apple Store Card UI Light */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full z-10">
        <div className="flex flex-col items-center mb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4">Store.</h1>
          <p className="text-xl text-gray-500 font-medium">The complete NOVE collection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: (index % 10) * 0.1 }}
            >
              <Link href={`/product/${product.id}`} className="group flex flex-col h-full bg-white rounded-[32px] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                {/* Text Content inside the card at the top */}
                <div className="p-8 pb-0 z-10 flex flex-col items-center text-center">
                  <h3 className="text-[#1d1d1f] text-2xl font-semibold tracking-tight mb-2">{product.name}</h3>
                  <span className="text-gray-500 font-regular text-lg">₹{product.price}</span>
                  <div className="flex space-x-2 mt-4">
                    {product.colors.map(color => (
                        <div key={color} className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color === 'Silver' ? '#d1d5db' : '#2c2c2e' }} title={color}></div>
                    ))}
                  </div>
                </div>
                
                {/* Product Image taking the rest of the card */}
                <div className="relative w-full aspect-square mt-4 flex items-center justify-center p-8">
                  <div className="relative w-full h-full">
                     <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain product-image"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </div>
  );
}
