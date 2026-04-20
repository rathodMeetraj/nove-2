import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ShieldCheck, Truck, Clock, ShieldAlert, Award, Recycle } from "lucide-react";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import ProductReviews from "@/components/ProductReviews";
import ArtisanRecommendations from "@/components/ArtisanRecommendations";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  // Delivery estimation logic
  const now = new Date();
  const currentHour = now.getHours();
  const deliveryDays = currentHour < 14 ? 2 : 3; // Before 2 PM gets it a day earlier
  const deliveryDate = new Date();
  deliveryDate.setDate(now.getDate() + deliveryDays);
  const deliveryString = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="flex flex-col min-h-screen pt-8 pb-32">
      <RecentlyViewedTracker product={product} />
      
      {/* Breadcrumbs & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8 mb-8 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-light uppercase tracking-widest">Back to Collection</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left: Image Viewer */}
        <div className="relative aspect-[4/5] glass-panel rounded-3xl flex items-center justify-center p-12 lg:sticky lg:top-32">
          {/* Ambient Glow behind product */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
          
          <div className="relative w-full h-full">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain product-image"
              priority
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center pt-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm tracking-[0.3em] text-gray-500 uppercase">Edition 01</span>
            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
            <span className="text-[10px] tracking-widest text-[#a8a8a9] uppercase font-bold border border-white/10 px-2 py-0.5 rounded">Limited Batch</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wide">{product.name}</h1>
          
          <div className="flex items-baseline space-x-4 mb-8">
            <p className="text-3xl font-light text-white">₹{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500 line-through">₹{(product.price * 1.5).toLocaleString()}</p>
          </div>
          
          <div className="h-px w-full bg-white/10 mb-8"></div>
          
          <p className="text-gray-400 font-light leading-relaxed mb-10 text-lg">
            {product.description} A masterpiece of modern design, featuring seamless contours and a glass-like finish that perfectly catches the light.
          </p>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-10 flex items-center space-x-4 group hover:border-white/20 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Express Delivery Promise</p>
              <p className="text-sm text-gray-200">Order in the next {24 - currentHour} hours for delivery by <span className="text-white font-medium">{deliveryString}</span></p>
            </div>
          </div>

          <ProductActions product={product} />

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
            <div className="flex items-start space-x-4">
               <div className="mt-1 p-2 rounded-xl bg-white/5 text-gray-400">
                  <Award size={20} />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium mb-1">Artisan Warranty</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">Protected by NOVE's 1-year global craftsmanship warranty.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="mt-1 p-2 rounded-xl bg-white/5 text-gray-400">
                  <Recycle size={20} />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium mb-1">Sustainable Soul</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">Crafted from carbon-neutral eucalyptus leather & glass.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="mt-1 p-2 rounded-xl bg-white/5 text-gray-400">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium mb-1">Authenticity Portal</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">Each piece includes a verified digital NFC certificate.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="mt-1 p-2 rounded-xl bg-white/5 text-gray-400">
                  <Truck size={20} />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium mb-1">Concierge Shipping</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">White-glove delivery experience with insured transit.</p>
               </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Featured Reviews & Recommendations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-32">
        <ProductReviews />
        <ArtisanRecommendations currentProductId={product.id} />
      </div>
    </div>
  );
}
