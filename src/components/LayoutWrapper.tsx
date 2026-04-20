"use client";

import { useState } from "react";
import SplashScreen from "./SplashScreen";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SmoothScroller from "./SmoothScroller";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./CartProvider";
import { WishlistProvider } from "./WishlistProvider";
import CartDrawer from "./CartDrawer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <WishlistProvider>
      <CartProvider>
        <SmoothScroller>
          <AnimatePresence mode="wait">
            {showSplash && (
              <SplashScreen 
                key="splash" 
                onComplete={() => setShowSplash(false)} 
              />
            )}
          </AnimatePresence>
          
          <Navigation />
          <CartDrawer />
          
          <main className="flex-grow pt-16 min-h-screen">
            {children}
          </main>

          <Footer />
        </SmoothScroller>
      </CartProvider>
    </WishlistProvider>
  );
}
