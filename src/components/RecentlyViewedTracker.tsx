"use client";

import { useEffect } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function RecentlyViewedTracker({ product }: { product: Product }) {
  useEffect(() => {
    const saved = localStorage.getItem("nove_recently_viewed");
    let list: Product[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [];
      }
    }

    // Remove current if exists, then add to front
    list = list.filter((p) => p.id !== product.id);
    list.unshift(product);

    // Keep only last 10
    list = list.slice(0, 10);

    localStorage.setItem("nove_recently_viewed", JSON.stringify(list));
  }, [product]);

  return null;
}
