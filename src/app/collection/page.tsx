"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Mountain, Moon } from "lucide-react";
import ArtisanAnatomy from "@/components/ArtisanAnatomy";

const COLLECTIONS = [
  {
    id: "terra",
    name: "The Terra Series",
    description: "Inspired by the raw textures of the earth. Handcrafted from organic eucalyptus leather with a rugged yet refined finish.",
    icon: Mountain,
    image: "/products/product_7.png",
    color: "bg-orange-50/50",
    link: "/store?collection=Terra+Series"
  },
  {
    id: "midnight",
    name: "The Midnight Series",
    description: "A study in shadow and light. Featuring deep obsidian finishes and liquid glass contours that catch every reflection.",
    icon: Moon,
    image: "/products/product_11.png",
    color: "bg-gray-100",
    link: "/store?collection=Midnight+Series"
  },
  {
    id: "artisan",
    name: "Artisan Collection",
    description: "The peak of NOVE craftsmanship. Limited run masterpieces featuring unique experimental materials and avant-garde silhouettes.",
    icon: Sparkles,
    image: "/products/product_3.png",
    color: "bg-blue-50/50",
    link: "/store?collection=Artisan+Collection"
  }
];

export default function CollectionPage() {
  return (
    <div className="bg-[#fbfbfd] min-h-screen pt-24 pb-32">
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1d1d1f] mb-6">Series.</h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Explore our curated collections, each telling a unique story of material innovation and silhouette discovery.</p>
        </motion.div>
      </section>

      <ArtisanAnatomy />

      <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        {COLLECTIONS.map((collection, idx) => (
          <motion.div 
            key={collection.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className={`relative rounded-[48px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 overflow-hidden ${collection.color}`}
          >
             {/* Text Content */}
             <div className="flex-1 z-10">
                <div className="flex items-center space-x-3 mb-6">
                   <collection.icon size={24} className="text-[#1d1d1f]" />
                   <span className="text-sm font-bold uppercase tracking-widest text-[#1d1d1f]">Featured Series</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-8">{collection.name}</h2>
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg">
                   {collection.description}
                </p>
                <Link 
                  href="/store"
                  className="inline-flex items-center gap-3 bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform group"
                >
                   Explore Series
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>

             {/* Image */}
             <div className="flex-1 relative aspect-square w-full scale-110">
                <motion.div 
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 1 }}
                   className="relative w-full h-full"
                >
                   <Image 
                    src={collection.image} 
                    alt={collection.name} 
                    fill 
                    className="object-contain product-image"
                   />
                </motion.div>
             </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
