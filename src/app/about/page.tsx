"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Star, Globe } from "lucide-react";

const VALUES = [
  {
    icon: Leaf,
    title: "Sustainably Crafted",
    desc: "Every NOVE piece is made using ethically sourced, organic eucalyptus leather — a revolutionary, cruelty-free alternative that feels incredible.",
  },
  {
    icon: Star,
    title: "Obsessive Quality",
    desc: "We believe in perfection at every stitch. Each bag passes a 47-point quality inspection before it ever reaches your hands.",
  },
  {
    icon: Globe,
    title: "Globally Inspired",
    desc: "NOVE is born from the intersection of Indian artisanship and European minimalism — a truly global luxury identity.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#fbfbfd] min-h-screen">

      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/40 via-gray-200/10 to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.05, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/50 via-gray-200/10 to-transparent"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <p className="text-sm tracking-widest uppercase text-gray-400 font-semibold mb-6">Our Story</p>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-[#1d1d1f] mb-8 leading-none">
            Designed for those who <em className="font-serif font-light not-italic text-gray-400">feel</em> luxury.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            NOVE was born from a simple belief: that a bag should feel like an extension of you — weightless, effortless, and perfectly beautiful.
          </p>
        </motion.div>
      </section>

      {/* Origin Story */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[70vh] rounded-[48px] overflow-hidden shadow-2xl bg-white"
          >
            <Image
              src="/products/product_7.png"
              alt="NOVE Origin"
              fill
              className="object-contain p-12 scale-110"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-sm tracking-widest uppercase text-gray-400 font-semibold mb-6">2019 · Vadodara, India</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-8 leading-tight">
              A quiet studio. A radical idea.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-6 font-light">
              NOVE began in a 400 sq. ft. studio in Vadodara. Our founder, frustrated by the choice between affordable synthetic bags and unethically produced leather, set out to create something entirely new.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 font-light">
              After two years of material research and collaboration with artisans across Rajasthan and Gujarat, we launched our first collection of 50 hand-stitched pieces. They sold out in 6 hours.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-3 bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform group"
            >
              View the Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f]">What we stand for.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#fbfbfd] rounded-[32px] p-10 flex flex-col"
              >
                <v.icon size={32} strokeWidth={1.5} className="text-[#1d1d1f] mb-6" />
                <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { num: "50K+", label: "Happy Customers" },
            { num: "23", label: "Signature Designs" },
            { num: "100%", label: "Sustainable Materials" },
            { num: "6h", label: "First Sellout Time" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-5xl font-bold text-[#1d1d1f] mb-2">{s.num}</p>
              <p className="text-gray-500 font-light">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-6">Ready to meet your next favourite thing?</h2>
          <Link
            href="/store"
            className="inline-flex items-center gap-3 bg-[#1d1d1f] text-white px-10 py-5 rounded-full text-lg font-medium hover:scale-105 transition-transform group"
          >
            Shop Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
