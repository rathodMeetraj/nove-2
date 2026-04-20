"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  RefreshCcw, 
  Clock, 
  CreditCard, 
  Truck,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  name: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerEmail: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: string;
  paymentMethod: string;
}

interface Stats {
  totalRevenue: number;
  orderCount: number;
  codOrders: number;
  onlineOrders: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedAdmin = localStorage.getItem("nove_admin");
    if (!savedAdmin) {
      router.push("/login");
      return;
    }
    setAdmin(JSON.parse(savedAdmin));
    fetchData();
  }, [router]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      if (res.ok) {
        fetchData(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nove_admin");
    router.push("/login");
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#161617] text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-2">
               <Link href="/store" className="text-gray-500 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
               </Link>
               <h1 className="text-4xl font-serif tracking-tight">Enterprise Console</h1>
            </div>
            <p className="text-gray-400 font-light italic">Welcome, {admin.name}</p>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search archives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-white/30 transition-all w-64 md:w-80"
              />
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              Sign Out
            </button>
            <button 
              onClick={fetchData}
              className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Total Revenue", value: `₹${stats?.totalRevenue.toLocaleString() || 0}`, sub: "GROSS SALES", icon: IndianRupee, color: "text-green-400" },
             { label: "Acquisitions", value: stats?.orderCount || 0, sub: "LIFETIME ORDERS", icon: ShoppingBag, color: "text-blue-400" },
             { label: "COD Pending", value: stats?.codOrders || 0, sub: "CASH ON DELIVERY", icon: Truck, color: "text-orange-400" },
             { label: "Online Paid", value: stats?.onlineOrders || 0, sub: "SECURE PAYMENTS", icon: CreditCard, color: "text-purple-400" },
           ].map((stat, i) => (
             <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 flex flex-col items-start"
             >
                <div className={`p-3 bg-white/5 rounded-2xl mb-6 ${stat.color}`}>
                   <stat.icon size={24} />
                </div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-1">{stat.label}</h3>
                <div className="text-3xl font-medium tracking-tighter mb-1">{stat.value}</div>
                <div className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 font-bold tracking-widest uppercase">
                  {stat.sub}
                </div>
             </motion.div>
           ))}
        </div>

        {/* Main Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] overflow-hidden"
        >
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
             <h2 className="text-2xl font-serif">Order Queue</h2>
             <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">REAL-TIME DATA STREAM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <th className="px-8 py-6">Reference</th>
                  <th className="px-8 py-6">Customer & Destination</th>
                  <th className="px-8 py-6">Method</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6">Amount</th>
                  <th className="px-8 py-6">Current Status</th>
                  <th className="px-8 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                         <p className="text-sm text-gray-500 font-light">Loading encrypted ledger...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-mono text-sm text-white/90">#{order.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-medium mb-1">{order.customerEmail}</div>
                        <div className="text-[11px] text-gray-500 font-light leading-snug max-w-[200px]">
                           {(order as any).shippingAddress ? (
                             <>
                               {(order as any).shippingAddress.street}, {(order as any).shippingAddress.city} - {(order as any).shippingAddress.pincode}
                             </>
                           ) : "Digital Collection Access"}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs">
                          {order.paymentMethod === 'Online' ? <CreditCard size={14} className="text-purple-400" /> : <Truck size={14} className="text-orange-400" />}
                          <span className="font-light">{order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
                           <Clock size={12} /> {order.date}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-lg font-medium tracking-tighter">₹{order.total.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                         <select 
                           value={order.status}
                           onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                           className={`bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] uppercase tracking-widest font-bold outline-none focus:border-white/30 transition-all ${
                              order.status === 'Delivered' ? 'text-green-400' : 
                              order.status === 'Shipped' ? 'text-blue-400' : 
                              'text-yellow-400'
                           }`}
                         >
                            {statuses.map(s => <option key={s} value={s} className="bg-[#1c1c1e] text-white">{s}</option>)}
                         </select>
                      </td>
                      <td className="px-8 py-6">
                        <button className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                           <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-gray-500 font-light">
                      No matching archives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
