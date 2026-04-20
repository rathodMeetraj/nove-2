"use client";

import { motion } from "framer-motion";
import { Check, Box, Truck, Home, Sparkles } from "lucide-react";

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Artisan Crafting';

const STEPS = [
  { status: 'Confirmed', icon: Check, label: 'Order Recieved' },
  { status: 'Artisan Crafting', icon: Sparkles, label: 'Handcrafting' },
  { status: 'Shipped', icon: Truck, label: 'In Transit' },
  { status: 'Delivered', icon: Home, label: 'Delivered' }
];

export default function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  // Determine progress index
  let activeIndex = 0;
  if (currentStatus === 'Shipped') activeIndex = 2;
  else if (currentStatus === 'Delivered') activeIndex = 3;
  else if (currentStatus === 'Processing') activeIndex = 1; // Processing map to Artisan Crafting for luxury feel
  else if (currentStatus === 'Artisan Crafting') activeIndex = 1;

  return (
    <div className="py-10 px-4">
      <div className="relative flex justify-between items-center max-w-lg mx-auto">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
        
        {/* Active Line Progress */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
          className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2 z-0 origin-left shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        ></motion.div>

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? '#fff' : '#1c1c1e',
                  color: isActive ? '#000' : '#4b5563',
                  borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.1)'
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors`}
              >
                <Icon size={14} strokeWidth={isCurrent ? 3 : 2} />
              </motion.div>
              <div className="absolute top-10 whitespace-nowrap text-center">
                <p className={`text-[9px] uppercase tracking-widest font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <motion.div 
                    layoutId="current-dot"
                    className="w-1 h-1 bg-white rounded-full mx-auto mt-1 shadow-[0_0_5px_#fff]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
