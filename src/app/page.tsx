"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Feather, Droplets, Gem } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import HangingBag from "@/components/HangingBag";

const HERO_IMAGES = [
  "/products/product_1.png",
  "/products/product_7.png",
  "/products/product_10.png",
  "/products/product_11.png",
  "/products/product_3.png",
];


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const craftsmanshipRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // 4 seconds per purse
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress: mainScrollY, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: craftsmanshipScroll } = useScroll({
    target: craftsmanshipRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: bentoScroll } = useScroll({
    target: bentoRef,
    offset: ["start end", "end start"]
  });

  // Section 1: Hero Transforms
  const heroOpacity = useTransform(scrollY, [0, 1500, 1800], [1, 1, 0]);
  const heroParallax = useTransform(scrollY, [0, 1800], [0, 900]);

  // Section 2: Craftsmanship Island Morphing
  const craftsmanshipScale = useTransform(craftsmanshipScroll, [0, 0.4, 0.6, 1], [0.85, 1, 1, 0.85]);
  const craftsmanshipRadius = useTransform(craftsmanshipScroll, [0, 0.4, 0.6, 1], ["60px", "0px", "0px", "60px"]);
  const craftsmanshipOpacity = useTransform(craftsmanshipScroll, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  // Section 3: Bento Island Morphing
  const bentoScale = useTransform(bentoScroll, [0, 0.4, 0.6, 1], [0.85, 1, 1, 0.85]);
  const bentoRadius = useTransform(bentoScroll, [0, 0.4, 0.6, 1], ["60px", "0px", "0px", "60px"]);
  const bentoOpacity = useTransform(bentoScroll, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col bg-[#fbfbfd] min-h-screen">
      <HangingBag onDropComplete={() => setIntroDone(true)} cardRef={cardRef} />
      
      <motion.div
         initial="hidden"
         animate={introDone ? "visible" : "hidden"}
         variants={{
           hidden: { opacity: 0, pointerEvents: "none" },
           visible: { 
             opacity: 1, 
             pointerEvents: "auto", 
             transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2, when: "beforeChildren" } 
           }
         }}
         className="w-full flex-grow flex flex-col"
      >
        {/* 1. Ethereal Liquid Hero */}
          <section className="relative h-[1800px] w-full flex flex-col items-center pt-[15vh]">
        {/* Soft Background Liquid Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/40 via-gray-200/10 to-transparent mix-blend-multiply" 
          />
          <motion.div 
            animate={{ 
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/50 via-gray-200/10 to-transparent mix-blend-multiply" 
          />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, y: heroParallax }}
          className="relative z-10 text-center flex flex-col items-center px-6 mt-[calc(65vh-200px)] md:mt-[calc(65vh-200px)]"
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-6xl md:text-8xl font-sans font-bold tracking-tighter text-[#1d1d1f] mb-4 md:mb-6"
          >
            Light as air.
          </motion.h1>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-xl md:text-3xl font-serif text-gray-400 italic font-light mb-8 md:mb-10"
          >
            The art of weightless elegance.
          </motion.h2>

          {/* Foreground Ethereal Product - Tactile iPhone Swiper */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="relative z-20 w-full max-w-[90vw] md:max-w-[450px] aspect-[4/3] md:aspect-[3/2] flex-shrink-0 mb-10"
          >
            {/* Glass Case Overlay Effect */}
            <div ref={cardRef} className="relative w-full h-full glass-display rounded-[40px] md:rounded-[60px] p-8 md:p-12 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) {
                      setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
                    } else if (info.offset.x < -100) {
                      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
                    }
                  }}
                  initial={{ x: 300, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -300, opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.4 }
                  }}
                  className="relative w-full h-full z-0 cursor-grab active:cursor-grabbing"
                >
                  <Image 
                    src={HERO_IMAGES[currentIndex]} 
                    alt="NOVE Masterpiece Collection" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    className="object-contain product-image select-none"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Pagination indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {HERO_IMAGES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "w-4 bg-black/60" : "w-1 bg-black/10"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
             variants={{
               hidden: { opacity: 0, scale: 0.9 },
               visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } }
             }}
          >
            <Link href="/store" className="glass px-8 py-4 rounded-full flex items-center space-x-3 hover:bg-white/90 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-95 group capitalize">
              <span className="text-[#1d1d1f] font-medium tracking-wide">Explore Store</span>
              <ArrowRight size={18} className="text-[#1d1d1f] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

      </section>

      {/* 2. Craftsmanship Narrative - Island Reveal */}
      <section ref={craftsmanshipRef} className="relative min-h-[150vh] z-20">
        <div className="sticky top-[80px] h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ 
              scale: craftsmanshipScale, 
              borderRadius: craftsmanshipRadius,
              opacity: craftsmanshipOpacity
            }}
            className="w-[95vw] h-[90vh] max-h-full bg-white shadow-2xl overflow-y-auto overflow-x-hidden flex items-center px-6 md:px-24 py-12 scrollbar-hide"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full max-w-7xl mx-auto h-full my-auto">
              <div className="relative h-[35vh] md:h-[50vh] w-full flex-shrink-0 flex items-center justify-center">
                <Image 
                  src="/products/product_11.png" 
                  alt="Texture Detail" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain product-image"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <span className="text-sm tracking-widest uppercase font-semibold text-gray-400 mb-4">The Feel</span>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-8 leading-tight">Liquid glass contours that catch the light perfectly.</h3>
                <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light">
                  Every NOVE handbag is sculpted, not just stitched. By analyzing the way light wraps around curved glass, we developed a silhouette that feels entirely fluid in motion while resting comfortably against your side.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Why NOVE Bento Box - Island Reveal */}
      <section ref={bentoRef} className="relative min-h-[150vh] z-20">
        <div className="sticky top-[80px] h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ 
              scale: bentoScale, 
              borderRadius: bentoRadius,
              opacity: bentoOpacity
            }}
            className="w-[95vw] h-[90vh] max-h-full bg-white shadow-2xl overflow-y-auto overflow-x-hidden flex items-center px-6 md:px-24 py-12 scrollbar-hide"
          >
            <div className="max-w-7xl mx-auto w-full py-10">
              <div className="text-center mb-10 md:mb-16 mt-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f]">Designed differently.</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
                <div className="col-span-1 md:col-span-2 bg-[#fbfbfd] rounded-[32px] p-10 flex flex-col items-start justify-between relative overflow-hidden group border border-gray-100">
                  <div className="z-10 max-w-md">
                    <Droplets size={32} strokeWidth={1} className="text-[#1d1d1f] mb-4" />
                    <h4 className="text-2xl font-semibold mb-3 text-[#1d1d1f]">Fluid Dynamics.</h4>
                    <p className="text-gray-500 text-base leading-relaxed">Inspired by falling water. The seamless exterior masks a hyper-organized interior.</p>
                  </div>
                  <div className="absolute right-[-5%] bottom-[-10%] w-[50%] h-full opacity-40 group-hover:scale-105 transition-transform duration-1000">
                     <Image src="/products/product_3.png" alt="Fluid" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain product-image" />
                  </div>
                </div>

                <div className="bg-[#1d1d1f] text-white rounded-[32px] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
                  <Feather size={32} strokeWidth={1} className="text-white mb-4" />
                  <h4 className="text-2xl font-semibold mb-3">Zero Gravity.</h4>
                  <p className="text-gray-400 text-base leading-relaxed">Engineered to feel totally weightless.</p>
                </div>

                <div className="bg-[#fbfbfd] border border-gray-100 rounded-[32px] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <Gem size={32} strokeWidth={1} className="text-[#1d1d1f] mb-4" />
                  <h4 className="text-2xl font-semibold mb-3 text-[#1d1d1f]">Ethical Luxury.</h4>
                  <p className="text-gray-500 text-base leading-relaxed">Sustainable organic derivatives.</p>
                </div>

                <div className="col-span-1 md:col-span-2 bg-white border border-gray-100 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between">
                   <div className="max-w-sm mb-6 md:mb-0">
                     <h4 className="text-2xl font-semibold mb-3 text-[#1d1d1f]">Ready to feel it?</h4>
                     <Link href="/store" className="inline-flex rounded-full bg-[#1d1d1f] text-white px-8 py-3 font-medium hover:scale-105 transition-transform">
                       Go to Store
                     </Link>
                   </div>
                   <div className="relative w-full md:w-1/2 h-full min-h-[200px]">
                       <Image src="/products/product_7.png" alt="Store" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain product-image" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </motion.div>
    </div>
  );
}

