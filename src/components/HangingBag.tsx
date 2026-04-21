"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useState, useRef, RefObject } from "react";

// Bag natural viewport-Y center when fixed: top-4px + 190px thread + 135px (half of 270px bag)
const BAG_NATURAL_Y = 4 + 190 + 135; // ≈ 329px

// Scroll position at which the arc landing is complete
const LAND_SCROLL = 1400;

export default function HangingBag({
  onDropComplete,
  cardRef,
}: {
  onDropComplete?: () => void;
  cardRef?: RefObject<HTMLDivElement | null>;
}) {
  const { scrollY } = useScroll();
  const [hasDropped, setHasDropped] = useState(false);

  // Measured once when entrance animation finishes (scroll is 0 at this moment)
  const landPageY = useRef(700);  // PAGE-coordinate Y of bag center destination
  const landDeltaX = useRef(0);   // X offset from bag center to card center

  const measureCard = () => {
    if (!cardRef?.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // scroll is ~0 here, so getBoundingClientRect().bottom ≈ page bottom of card

    // X: align bag center with card center (both centered → delta ≈ 0)
    landDeltaX.current = rect.left + rect.width / 2 - window.innerWidth / 2;

    // Y: place bag CENTER just below the card bottom with a small gap
    const gapBelow = 40;
    landPageY.current = rect.bottom + gapBelow + 135; // +135 = half bag height
  };

  const smooth = useSpring(scrollY, { stiffness: 60, damping: 20, restDelta: 0.001 });

  // ─── Unified Y transform ──────────────────────────────────────────────────
  // Phase 1 (0 → LAND_SCROLL): arc from hanging position down to below card
  // Phase 2 (LAND_SCROLL+):    bag tracks page scroll → appears to stay on the page
  const bagY = useTransform(smooth, (s) => {
    if (s <= LAND_SCROLL) {
      // Arc: 0→480 swing left (no Y change), 480→LAND_SCROLL descend toward target
      const progress = s <= 480 ? 0 : (s - 480) / (LAND_SCROLL - 480);
      // At LAND_SCROLL, the card has scrolled up by LAND_SCROLL px,
      // so the target viewport Y = landPageY - LAND_SCROLL
      // The bag transform Y needed = target viewport Y - BAG_NATURAL_Y
      const targetTransformY = (landPageY.current - LAND_SCROLL) - BAG_NATURAL_Y;
      return Math.min(1, progress) * targetTransformY;
    } else {
      // Lock: bag stays at page-coordinate landPageY
      // viewport Y should = landPageY - scrollY
      // transform Y = (landPageY - s) - BAG_NATURAL_Y
      return (landPageY.current - s) - BAG_NATURAL_Y;
    }
  });

  // ─── X: swing left then arc to card center ────────────────────────────────
  const bagX = useTransform(smooth, (s) => {
    const clamped = Math.max(0, Math.min(LAND_SCROLL, s));
    if (clamped <= 480) {
      // Swing left 0 → -440
      return (clamped / 480) * -440;
    } else {
      // Arc back: -440 → landDeltaX (≈ 0)
      const p = (clamped - 480) / (LAND_SCROLL - 480);
      return -440 + p * (440 + landDeltaX.current);
    }
  });

  // ─── Scale ────────────────────────────────────────────────────────────────
  // Full size while swinging, stays full size when resting below card
  const bagScale = useTransform(smooth, [0, LAND_SCROLL], [1, 1]);

  // ─── Opacity ──────────────────────────────────────────────────────────────
  // Stays at 1 permanently — no fade out
  const bagOpacity = useTransform(smooth, [0, 1], [1, 1]);

  // ─── Thread ───────────────────────────────────────────────────────────────
  const threadHeight  = useTransform(smooth, [0, 480, 1200], [190, 190, 0]);
  const threadOpacity = useTransform(smooth, [0, 480, 1100], [1, 1, 0]);
  const threadRotate  = useTransform(smooth, [0, 480, 900], [0, -14, 0]);

  // ─── Pendulum sway fades as bag starts its descent ───────────────────────
  const swayOpacity = useTransform(smooth, [400, 750], [1, 0]);

  return (
    <>
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
            measureCard(); // measure once — before user scrolls
            onDropComplete?.();
          }
        }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
      >
        {/* Thread */}
        <motion.div
          style={{ height: threadHeight, opacity: threadOpacity, rotate: threadRotate }}
          className="w-[1px] bg-gradient-to-b from-gray-300/0 via-gray-300 to-gray-300/50 origin-top"
        />

        {/* Bag */}
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
          <motion.div
            style={{ opacity: swayOpacity }}
            className="pendulum-sway w-full h-full relative"
          >
            <div className="relative w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.07)]">
              <Image
                src="/products/product_1.png"
                alt="Hanging Masterpiece"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
