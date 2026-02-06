"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type Product } from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";

// Placeholder products for when the API is not available
const placeholderProducts: Product[] = [
  {
    id: "1",
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "headphones",
    price: 349.99,
    compareAtPrice: 399.99,
    description: "Industry-leading noise cancellation with exceptional sound quality.",
    images: [],
    variants: [
      { id: "v1", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true },
      { id: "v2", name: "Silver", color: "Silver", colorHex: "#c0c0c0", inStock: true },
    ],
    specs: { driver: "30mm", battery: "30 hours", weight: "250g", bluetooth: "5.2" },
    compatibility: ["iOS", "Android", "Windows"],
    rating: 4.8,
    reviewCount: 2341,
    inStock: true,
  },
  {
    id: "2",
    slug: "apple-watch-series-9",
    name: "Apple Watch Series 9 GPS + Cellular",
    brand: "Apple",
    category: "smartwatches",
    price: 499.99,
    description: "The most powerful Apple Watch yet with advanced health features.",
    images: [],
    variants: [
      { id: "v3", name: "Midnight", color: "Midnight", colorHex: "#1d1d1f", inStock: true },
      { id: "v4", name: "Starlight", color: "Starlight", colorHex: "#f5e6d3", inStock: true },
    ],
    specs: { display: "OLED", battery: "18 hours", water: "50m", chip: "S9" },
    compatibility: ["iOS"],
    rating: 4.7,
    reviewCount: 1856,
    inStock: true,
  },
  {
    id: "3",
    slug: "bose-quietcomfort-ultra-earbuds",
    name: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose",
    category: "earbuds",
    price: 299.99,
    description: "Immersive spatial audio with world-class noise cancellation.",
    images: [],
    variants: [
      { id: "v5", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true },
      { id: "v6", name: "White Smoke", color: "White Smoke", colorHex: "#e8e3df", inStock: true },
    ],
    specs: { driver: "9.3mm", battery: "6 hours", case: "24 hours", bluetooth: "5.3" },
    compatibility: ["iOS", "Android"],
    rating: 4.6,
    reviewCount: 987,
    inStock: true,
  },
  {
    id: "4",
    slug: "jbl-charge-5",
    name: "JBL Charge 5 Portable Bluetooth Speaker",
    brand: "JBL",
    category: "speakers",
    price: 179.99,
    compareAtPrice: 199.99,
    description: "Bold sound with powerful bass and built-in power bank.",
    images: [],
    variants: [
      { id: "v7", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true },
      { id: "v8", name: "Blue", color: "Blue", colorHex: "#3b82f6", inStock: true },
      { id: "v9", name: "Red", color: "Red", colorHex: "#ef4444", inStock: true },
    ],
    specs: { power: "30W", battery: "20 hours", waterproof: "IP67", bluetooth: "5.1" },
    compatibility: ["iOS", "Android"],
    rating: 4.7,
    reviewCount: 3421,
    inStock: true,
  },
];

function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[var(--sonica-bg)]" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded bg-[var(--sonica-bg)]" />
        <div className="h-4 w-full rounded bg-[var(--sonica-bg)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--sonica-bg)]" />
        <div className="h-3 w-20 rounded bg-[var(--sonica-bg)]" />
        <div className="h-6 w-24 rounded bg-[var(--sonica-bg)]" />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => api.products.getFeatured(),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const products = isError || !data ? placeholderProducts : data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
