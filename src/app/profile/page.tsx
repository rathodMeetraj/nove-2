"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, User, LogOut, ChevronRight, ShoppingBag, Clock, CreditCard, Truck, Heart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/components/WishlistProvider";
import OrderTimeline from "@/components/OrderTimeline";

interface Order {
  id: string;
  date: string;
  total: number;
  items: any[];
  status: string;
  paymentMethod: string;
  shippingAddress?: {
    street: string;
    city: string;
    pincode: string;
  };
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      fetch(`/api/orders/history?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(err => console.error("Error fetching orders:", err))
        .finally(() => setFetchingOrders(false));
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#161617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#161617] text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-serif mb-2 tracking-tight">Bonjour, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-400 font-light text-lg">Manage your NOVE experience and collection.</p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium"
          >
            Sign Out <LogOut size={16} />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar / Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <User size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-medium mb-1">{user.name}</h3>
              <p className="text-gray-400 text-sm font-light mb-6">{user.email}</p>
              
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">
                Edit Profile
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8">
              <h3 className="text-sm uppercase tracking-widest text-gray-400 font-medium mb-4">Membership</h3>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="font-medium tracking-tight">NOVE Elite Status</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content / Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif">Recent Orders</h2>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium tracking-tighter">
                  {orders.length} TOTAL
                </span>
              </div>

              {fetchingOrders ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm font-light">Retrieving your collection...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group flex flex-col"
                    >
                      <div 
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className={`bg-white/[0.03] hover:bg-white/[0.08] border transition-all flex items-center justify-between p-6 cursor-pointer ${expandedOrder === order.id ? 'rounded-t-[32px] border-white/20 bg-white/[0.08]' : 'rounded-[32px] border-white/5'}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingBag size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h4>
                              <span className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border ${
                                order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              }`}>
                                {order.status !== 'Delivered' && <span className="w-1 h-1 rounded-full bg-current animate-pulse" />}
                                {order.status || 'Artisan Crafting'}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-light uppercase tracking-widest flex items-center gap-4">
                              <span>{order.date}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-800" />
                              <span>{order.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                             <div className="text-lg font-medium tracking-tighter">₹{order.total.toLocaleString('en-IN')}</div>
                             <div className="text-[9px] text-gray-500 uppercase tracking-widest">{order.items.length} Items</div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedOrder === order.id ? 90 : 0 }}
                          >
                            <ChevronRight size={18} className="text-gray-600" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/[0.04] border-x border-b border-white/10 rounded-b-[32px]"
                          >
                            <div className="p-8">
                               <h5 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-6">Artisan Journey</h5>
                               <OrderTimeline currentStatus={order.status || 'Artisan Crafting'} />
                               
                               <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/5">
                                  <div>
                                     <h5 className="text-xs text-white/40 uppercase tracking-widest mb-4">Destination</h5>
                                     <p className="text-sm font-light text-gray-300 leading-relaxed">
                                        {order.shippingAddress?.street}<br />
                                        {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                                     </p>
                                  </div>
                                  <div>
                                     <h5 className="text-xs text-white/40 uppercase tracking-widest mb-4">Service</h5>
                                     <div className="flex items-center gap-2 text-sm font-light text-gray-300">
                                        <Truck size={14} className="text-gray-500" />
                                        <span>Concierge Shipping (2-4 Days)</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Package size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-serif mb-2">No orders yet</h3>
                  <p className="text-gray-500 font-light mb-8 max-w-xs">Your NOVE journey begins with your first selection.</p>
                  <Link 
                    href="/store"
                    className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    Explore Collection
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist Section */}
            <div id="wishlist" className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 min-h-[300px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Heart size={24} className="text-white" />
                  <h2 className="text-2xl font-serif">Artisan Wishlist</h2>
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium tracking-tighter">
                  {wishlist.length} ITEMS
                </span>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-3xl p-4 transition-all flex items-center gap-4">
                       <div className="relative w-16 h-20 bg-white/5 rounded-2xl p-2 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-light text-white mb-1 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500">₹{item.price.toLocaleString()}</p>
                       </div>
                       <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          >
                             <Trash2 size={14} />
                          </button>
                          <Link 
                            href={`/product/${item.id}`}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                          >
                             <ArrowRight size={14} />
                          </Link>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Heart size={32} className="text-gray-700 mb-4" />
                  <p className="text-gray-500 text-sm font-light">Your wishlist is waiting for its first masterpiece.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
