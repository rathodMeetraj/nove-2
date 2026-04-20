"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import SearchOverlay from "./SearchOverlay";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/store" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/about" },
];

export default function Navigation() {
  const { user } = useAuth();
  const { items, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isExpanded = isScrolled || isManuallyExpanded;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
        <motion.header
          onClick={() => setIsManuallyExpanded(!isManuallyExpanded)}
          layout
          initial={false}
          animate={{
            width: isExpanded ? "95vw" : "200px",
            height: isExpanded ? "64px" : "44px",
            borderRadius: isExpanded ? "24px" : "999px",
            backgroundColor: isExpanded ? "rgba(242, 242, 247, 0.85)" : "rgba(242, 242, 247, 0.5)",
            backdropFilter: isExpanded ? "blur(30px)" : "blur(10px)",
            y: isExpanded ? 0 : 10,
          }}
          className="relative pointer-events-auto border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex items-center px-6 max-w-7xl mx-auto cursor-pointer"
        >
          <div className="flex w-full items-center justify-between gap-4">
            {/* Left: Nav Links */}
            <AnimatePresence>
              {isExpanded && (
                <motion.nav
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hidden md:flex space-x-8 items-center"
                >
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[13px] text-gray-400 hover:text-[#1d1d1f] transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Mobile Menu Icon (collapsed only) */}
            {!isExpanded && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(true); }}
                className="md:hidden text-gray-500"
              >
                <Menu size={18} />
              </motion.button>
            )}

            {/* Center: Logo */}
            <motion.div
              layout
              className={`flex-shrink-0 flex items-center justify-center ${isExpanded ? "" : "absolute left-1/2 -translate-x-1/2"}`}
            >
              <Link
                href="/"
                onClick={(e) => e.stopPropagation()}
                className={`${isExpanded ? "text-xl" : "text-lg"} font-serif text-[#1d1d1f]/90 tracking-[0.1em] font-medium transition-all duration-500`}
              >
                NOVE
              </Link>
            </motion.div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-4">
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="hidden md:flex items-center space-x-4"
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); setIsSearchOpen(true); }}
                      className="text-[#1d1d1f]/60 hover:text-black transition-colors"
                    >
                      <Search size={18} strokeWidth={2} />
                    </motion.button>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Link
                        href={user ? (user.email === 'admin@nove.in' ? '/admin' : '/profile') : "/login"}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#1d1d1f]/60 hover:text-black transition-colors flex items-center gap-2"
                      >
                        <User size={18} strokeWidth={2} />
                        {user && <span className="text-[11px] font-bold uppercase tracking-tighter text-[#1d1d1f]/40">Profile</span>}
                      </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Link
                        href="/profile#wishlist"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#1d1d1f]/70 hover:text-black transition-colors relative h-8 w-8 flex items-center justify-center p-0 m-0 border-none bg-transparent cursor-pointer"
                      >
                        <Heart size={18} strokeWidth={2} className={wishlist.length > 0 ? "fill-[#1d1d1f]" : ""} />
                        {wishlist.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1d1d1f] text-[9px] font-bold text-white shadow-sm scale-90 border border-white/20">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setIsCartOpen(true); }}
                className="text-[#1d1d1f]/80 hover:text-black transition-colors relative h-10 w-10 flex items-center justify-center p-0 m-0 border-none bg-transparent cursor-pointer"
              >
                <ShoppingBag size={isExpanded ? 20 : 18} strokeWidth={2} />
                {items.length > 0 && (
                  <span className="absolute top-1 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1d1d1f] text-[9px] font-bold text-white shadow-sm scale-90 border border-white/20">
                    {items.length}
                  </span>
                )}
              </motion.button>

              {isExpanded && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                  className="md:hidden text-[#1d1d1f]"
                >
                  <Menu size={20} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.header>
      </div>

      {/* Navigation Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Overlay - Premium iOS Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 400 }}
            className="fixed inset-0 z-[60] bg-[#fbfbfd]/80 backdrop-blur-3xl flex flex-col pt-safe"
          >
            <div className="flex justify-between items-center px-8 py-10">
              <span className="font-serif text-3xl tracking-widest text-[#1d1d1f]">NOVE</span>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-3 bg-[#1d1d1f]/5 rounded-full"
              >
                <X size={24} strokeWidth={1} />
              </motion.button>
            </div>
            
            <motion.div 
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col space-y-6 p-10 mt-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.label}
                  variants={{
                    open: { opacity: 1, x: 0, scale: 1 },
                    closed: { opacity: 0, x: -20, scale: 0.95 }
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-5xl text-[#1d1d1f] font-bold tracking-tighter hover:text-gray-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 }
                }}
                className="pt-12 mt-12 border-t border-[#1d1d1f]/5"
              >
                <Link
                  href={user ? (user.email === 'admin@nove.in' ? '/admin' : '/profile') : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl text-gray-400 font-medium tracking-tight flex items-center justify-between"
                >
                  <span>{user ? `Account (${user.name.split(' ')[0]})` : "Sign In / Register"}</span>
                  <ArrowRight size={20} className="text-[#1d1d1f]/20" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

