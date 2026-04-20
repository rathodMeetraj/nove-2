"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Massive offsets to ensure it looks like a cloud of parts, not a bag
const PARTS = [
  { 
    id: "strap", 
    label: "Hand-stitched Bio-Strap", 
    initialX: -300, // No longer centered by default
    initialY: -500, 
    rotation: -45,
    clipPath: "inset(0 0 55% 0)" 
  },
  { 
    id: "buckle-l", 
    label: "Solid Titanium Hardware", 
    initialX: -550, 
    initialY: 400, 
    rotation: -60,
    clipPath: "inset(50% 50% 0 0)" 
  },
  { 
    id: "buckle-r", 
    label: "Laser-Locked Buckles", 
    initialX: 550, 
    initialY: 400, 
    rotation: 60,
    clipPath: "inset(50% 0 0 50%)" 
  },
  { 
    id: "body", 
    label: "Eucalyptus Silk Lining", 
    initialX: 300, // Shifted from center
    initialY: 600, 
    rotation: 15,
    clipPath: "inset(15% 10% 15% 10%)" 
  }
];

export default function ArtisanAnatomy() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background state transitions - forced to start dark
  const bgOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.8, 1, 1, 0]);
  
  // Transformation lifecycle:
  // Starts FULLY DECONSTRUCTED at 0.0
  const universalScale = useTransform(scrollYProgress, [0.4, 0.6, 0.9], [0.8, 1.1, 1.4], { clamp: true });
  const idleRotation = useTransform(scrollYProgress, [0.6, 0.9], [0, 8], { clamp: true });
  const mainOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1], { clamp: true });

  return (
    <section 
      ref={containerRef} 
      className="relative h-[750vh] bg-[#1d1d1f] w-full"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-32">
        
        {/* Atmosphere */}
        <div className="absolute inset-0 z-0">
           <motion.div 
             style={{ opacity: bgOpacity }}
             className="absolute top-[30%] left-[15%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-white/0 to-transparent" 
           />
           <motion.div 
             style={{ opacity: bgOpacity }}
             className="absolute bottom-[30%] right-[15%] w-[400px] md:w-[500px] h-[400px] md:h-[500px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-white/0 to-transparent" 
           />
        </div>

        {/* The Title Area */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0, 0], { clamp: true }),
            y: useTransform(scrollYProgress, [0, 0.45], [50, -50], { clamp: true })
          }}
          className="absolute top-32 md:top-44 text-center z-20 px-8"
        >
           <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/40 mb-4">Precision Engineering</h2>
           <p className="text-2xl md:text-5xl font-serif italic text-white font-light tracking-tight leading-tight max-w-lg mx-auto">Separating the masterpiece from the mundane.</p>
        </motion.div>

        {/* The Exploding Bag Container */}
        <div className="relative w-full max-w-5xl h-[40vh] md:h-[60vh] flex items-center justify-center translate-y-24 md:translate-y-36">
            
            {/* Base Full Bag (Starts completely hidden) */}
            <motion.div 
              style={{
                opacity: useTransform(scrollYProgress, [0.58, 0.68, 0.95, 1], [0, 1, 1, 0], { clamp: true }),
                scale: universalScale,
                rotate: idleRotation,
                // filter: mainBlur replaced with universal scale handling opacity indirectly
              }}
              className="absolute inset-0 flex items-center justify-center z-30"
            >
               <div className="relative w-[280px] h-[180px] md:w-[600px] md:h-[400px]">
                  <Image 
                    src="/products/product_7.png" 
                    alt="Finished NOVE" 
                    fill
                    className="object-contain" 
                    priority 
                  />
               </div>
            </motion.div>

            {/* Exploding Parts - RESPONSIVE SCATTER */}
            {PARTS.map((part) => {
               // Adjust offsets for mobile viewports
               const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
               const mobileFactor = isMobile ? 0.4 : 1; 

               const x = useTransform(scrollYProgress, [0.05, 0.6], [part.initialX * mobileFactor, 0], { clamp: true });
               const y = useTransform(scrollYProgress, [0.05, 0.6], [part.initialY * mobileFactor, 0], { clamp: true });
               const rotate = useTransform(scrollYProgress, [0.05, 0.6], [part.rotation, 0], { clamp: true });
               
               const partOpacity = useTransform(scrollYProgress, [0, 0.1, 0.68, 0.78], [0, 1, 1, 0], { clamp: true });
               const labelOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.52, 0.62], [0, 1, 1, 0], { clamp: true });

               return (
                 <motion.div
                   key={part.id}
                   style={{ 
                     x, y, rotate, opacity: partOpacity,
                     scale: universalScale, 
                     zIndex: 10
                   }}
                   className="absolute inset-0 flex items-center justify-center pointer-events-none"
                 >
                    <div className="relative w-[280px] h-[180px] md:w-[600px] md:h-[400px]">
                        <Image 
                          src="/products/product_7.png" 
                          alt={part.label} 
                          fill
                          className="object-contain"
                          style={{ clipPath: part.clipPath }}
                          priority
                        />
                        
                        {/* Labels - Improved Mobile Positioning */}
                        <motion.div 
                          style={{ opacity: labelOpacity }}
                          className={`absolute flex items-center gap-2 md:gap-4 whitespace-nowrap ${
                            part.id === 'strap' ? 'top-[-30%] md:top-[-25%] right-[-5%] md:right-[-10%]' :
                            part.id === 'buckle-l' ? 'bottom-[5%] md:bottom-[0%] left-[-20%] md:left-[-35%]' :
                            part.id === 'buckle-r' ? 'bottom-[5%] md:bottom-[0%] right-[-20%] md:right-[-35%]' :
                            'top-[40%] left-[-25%] md:left-[-45%]'
                          }`}
                        >
                           <div className="w-6 md:w-12 h-[1px] bg-white/40"></div>
                           <div>
                              <p className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 mb-0.5 md:mb-1">{part.id}</p>
                              <h4 className="text-white text-[10px] md:text-xs font-light tracking-widest">{part.label}</h4>
                           </div>
                        </motion.div>
                    </div>
                 </motion.div>
               );
            })}
        </div>

        {/* Finishing Label */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.8, 0.9, 0.95, 1], [0, 1, 1, 0], { clamp: true }),
            y: useTransform(scrollYProgress, [0.8, 0.9], [30, 0], { clamp: true })
          }}
          className="absolute bottom-32 md:bottom-40 text-center z-40 px-10"
        >
           <h3 className="text-xl md:text-3xl font-serif italic text-white/80 font-light tracking-tight pb-6">A unified vision of sustainable luxury.</h3>
           <div className="w-px h-16 md:h-24 bg-gradient-to-b from-white/40 to-transparent mx-auto"></div>
        </motion.div>
      </div>
    </section>
  );
}
