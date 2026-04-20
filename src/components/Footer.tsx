"use client";

import Link from "next/link";
import { ShieldCheck, Globe } from "lucide-react";

const FOOTER_LINKS = [
  { name: "Store", href: "/store" },
  { name: "Collection", href: "/collection" },
  { name: "FAQ", href: "/faq" },
  { name: "Shipping", href: "/shipping" },
  { name: "Policies", href: "/policy" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#fbfbfd] border-t border-gray-100 py-16 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Link href="/" className="text-3xl font-serif text-[#1d1d1f] tracking-widest font-bold mb-10">
          NOVE
        </Link>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-[#1d1d1f] font-medium text-sm hover:opacity-60 transition-opacity">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8 border-t border-black/5 text-[11px] text-[#86868b] uppercase tracking-widest font-bold gap-4">
           <div className="flex flex-wrap justify-center items-center gap-4">
              <span>© 2026 NOVE</span>
              <div className="flex items-center space-x-2">
                 <ShieldCheck size={12} />
                 <span>Secured</span>
              </div>
           </div>
           <div className="flex items-center space-x-2">
              <Globe size={12} />
              <span>International</span>
           </div>
        </div>
      </div>
    </footer>
  );
}

