"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // Zoom into 'O' after writing finishes
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, 3200);

    // Completely unmount after 5 seconds to let user use the app
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isZooming ? 0 : 1 }}
      transition={{ duration: 1, delay: 0.6 }} // fade out whole splash screen smoothly
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-transparent"
        initial={{ scale: 1 }}
        animate={isZooming ? { scale: 150 } : { scale: 1 }}
        style={{ transformOrigin: "42.5% 50%" }} // Adjusted center for 'O' in NOVE in Bodoni
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} 
      >
        {/*
          Injecting a specific, highly visible purse directly behind the text mask for the splash screen
          so the "design and shape" is unmistakably distinct.
        */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center -z-10"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* We use 3 different distinct purses layered or positioned so their shapes peek through the letters clearly */}
          <div className="absolute w-[30vw] h-[30vw] left-[15%] top-1/2 -translate-y-1/2 opacity-70">
            <img src="/products/product_4.png" alt="Purse" className="w-full h-full object-contain" />
          </div>
          <div className="absolute w-[30vw] h-[30vw] right-[15%] top-1/2 -translate-y-1/2 opacity-70">
            <img src="/products/product_8.png" alt="Purse" className="w-full h-full object-contain" />
          </div>
          <div className="absolute w-[40vw] h-[40vw] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <img src="/products/product_14.png" alt="Purse" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </motion.div>

        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
          <defs>
            <mask id="hole-mask">
              <rect width="100%" height="100%" fill="white" />
              <text 
                x="50%" 
                y="50%" 
                textAnchor="middle" 
                dominantBaseline="central" 
                className="text-[100px] md:text-[200px] font-serif tracking-[0.1em]"
                fill="black"
              >
                NOVE
              </text>
            </mask>
          </defs>
          
          <rect 
            width="100%" 
            height="100%" 
            fill="#fbfbfd" 
            mask="url(#hole-mask)" 
          />
        </svg>

        {/* 
          Handwriting simulation:
          A solid block of #fbfbfd that shrinks from left to right.
          This uncovers the "holes" (NOVE) letter by letter like writing ink.
        */}
        <motion.div
           className="absolute inset-y-0 right-0 bg-[#fbfbfd]"
           initial={{ left: "0%" }}
           animate={{ left: "100%" }}
           transition={{
             duration: 2.5,
             ease: "easeInOut",
             delay: 0.5 // Start writing 0.5s after load
           }}
        />
      </motion.div>
    </motion.div>
  );
}
