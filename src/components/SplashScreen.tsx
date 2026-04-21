"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // Prevent scrolling while splash screen is active
    document.body.style.overflow = "hidden";

    // Zoom into 'O' after writing finishes
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, 3200);

    // Completely unmount after 5 seconds to let user use the app
    const exitTimer = setTimeout(() => {
      document.body.style.overflow = ""; // Restore scroll
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(exitTimer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#fbfbfd] pointer-events-auto touch-none"
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
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
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
