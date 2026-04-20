"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, X, Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "./WishlistProvider";

type ProductActionsProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    colors: string[];
  }
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      quantity: 1
    });
  };

  return (
    <div className="mb-8">
      {/* Color Selection */}
      <div className="mb-10">
        <h3 className="text-sm font-light text-gray-400 uppercase tracking-widest mb-4">Select Finish: <span className="text-white">{selectedColor}</span></h3>
        <div className="flex space-x-4">
            {product.colors.map(color => (
              <button 
                key={color} 
                onClick={() => setSelectedColor(color)}
                className="group flex flex-col items-center space-y-2"
              >
                <div 
                  className={`w-10 h-10 rounded-full border p-1 transition-all ${selectedColor === color ? 'border-white' : 'border-white/20 hover:border-white/50'}`}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color === 'Silver' ? '#d1d5db' : '#1f2937' }}></div>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Add to Bag and Wishlist buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-white text-[#161617] rounded-full py-5 text-lg font-medium hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] flex items-center justify-center gap-3"
        >
          Add to Bag
        </button>

        <button 
          onClick={() => {
            if (isInWishlist(product.id)) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
              });
            }
          }}
          className={`w-16 rounded-full flex items-center justify-center border transition-all ${
            isInWishlist(product.id) 
              ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
              : 'bg-transparent border-white/20 text-white hover:border-white/50'
          }`}
          title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={24} className={isInWishlist(product.id) ? "fill-current" : ""} />
        </button>
      </div>

      {/* iOS Style Auth Gate Modal */}
      <AnimatePresence>
        {showAuthGate && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthGate(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] px-6"
            >
              <div className="bg-[#1c1c1e] border border-white/10 rounded-[40px] p-10 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <button 
                  onClick={() => setShowAuthGate(false)}
                  className="absolute top-6 right-8 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center mx-auto mb-8">
                  <ShieldAlert size={40} className="text-white" />
                </div>

                <h2 className="text-3xl font-serif text-white mb-4">Elevate the Experience</h2>
                <p className="text-gray-400 font-light mb-10 text-lg leading-relaxed">
                  Join the NOVE world to build your luxury collection and manage your artisan selections.
                </p>

                <div className="flex flex-col gap-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-bold hover:bg-gray-200 transition-colors group"
                  >
                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button 
                    onClick={() => setShowAuthGate(false)}
                    className="text-sm text-gray-500 font-medium hover:text-gray-300 transition-colors"
                  >
                    Browse as Guest
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

