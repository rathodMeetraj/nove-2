"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function HangingBag({ onDropComplete }: { onDropComplete?: () => void }) {
  const { scrollY } = useScroll();
  const [hasDropped, setHasDropped] = useState(false);

  // Smooth spring - low stiffness so it tracks scroll without bouncing
  const smooth = useSpring(scrollY, { stiffness: 60, damping: 20, restDelta: 0.001 });

  // Scroll-driven transforms (initial drop is now handled by entrance animation)
  const threadHeight = useTransform(smooth, [0, 2000, 2400], [190, 190, 0]);
  const bagOpacity   = useTransform(smooth, [0, 2100, 2400], [1, 1, 0]);
  const bagY         = useTransform(smooth, [0, 2100, 2400], [0, 0, -30]);
  const bagScale     = useTransform(smooth, [0, 2100, 2400], [1, 1, 0.85]);
  const bagX         = useTransform(smooth, [0, 480, 2000, 2400], [0, -440, -440, 0]);
  const threadRotate = useTransform(smooth, [0, 480, 2000, 2400], [0, -14, -14, 0]);

  return (
    <>
      {/* Inject CSS-only pendulum keyframe — no JS, no conflicts */}
      <style>{`
        @keyframes pendulumSway {
          0%   { rotate: -4deg; }
          50%  { rotate:  4deg; }
          100% { rotate: -4deg; }
        }
        .pendulum-sway {
          animation: pendulumSway 6s ease-in-out infinite;
          will-change: rotate;
        }
      `}</style>

      <motion.div 
        initial={{ y: -600, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 4.2 }}
        onAnimationComplete={() => {
          if (!hasDropped) {
            setHasDropped(true);
            onDropComplete?.();
          }
        }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
      >
        {/* Thread */}
        <motion.div
          style={{ height: threadHeight, rotate: threadRotate }}
          className="w-[1px] bg-gradient-to-b from-gray-300/0 via-gray-300 to-gray-300/50 origin-top"
        />

        {/* Scroll-driven container — NO animate prop, avoids conflict */}
        <motion.div
          style={{
            opacity: bagOpacity,
            y: bagY,
            x: bagX,
            scale: bagScale,
            rotate: threadRotate,
            willChange: "transform",
          }}
          className="relative w-[270px] h-[270px] mt-[-8px]"
        >
          {/* Pure CSS sway child — isolated from scroll transforms */}
          <div className="pendulum-sway w-full h-full relative">
            <div className="relative w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.07)]">
              <Image
                src="/products/product_1.png"
                alt="Hanging Masterpiece"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

