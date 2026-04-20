"use client";

import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ArtisanRecommendations({ currentProductId }: { currentProductId: string }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Recommend 4 other products randomly - client side only to avoid hydration mismatch
    const shuffled = [...products]
      .filter(p => p.id !== currentProductId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    setRecommendations(shuffled);
  }, [currentProductId]);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-24">
      <div className="flex items-end justify-between mb-16">
        <div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-tight">Artisan Recommendations</h2>
          <p className="text-gray-500 font-light tracking-widest uppercase text-[10px]">Curated pairings for your collection</p>
        </div>
        <Link href="/store" className="group flex items-center space-x-2 text-white/50 hover:text-white transition-all text-sm uppercase tracking-widest font-medium">
          <span>View All</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {recommendations.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`}
            className="group block"
          >
            <div className="relative aspect-[4/5] glass-panel rounded-3xl mb-6 overflow-hidden flex items-center justify-center p-8 transition-all group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Image 
                src={product.image} 
                alt={product.name} 
                width={200} 
                height={250} 
                className="object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="text-white text-sm font-light tracking-wide mb-2 group-hover:text-gray-300 transition-colors">{product.name}</h3>
            <p className="text-gray-500 text-xs font-light">₹{product.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
