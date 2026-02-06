"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { api, type Product } from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name: A-Z" },
];

// Placeholder products for demo
const placeholderProducts: Product[] = [
  {
    id: "1", slug: "sony-wh-1000xm5", name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony", category: "headphones", price: 349.99, compareAtPrice: 399.99,
    description: "Industry-leading noise cancellation.", images: [],
    variants: [{ id: "v1", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true }],
    specs: { driver: "30mm", battery: "30 hours" }, compatibility: ["iOS", "Android", "Windows"],
    rating: 4.8, reviewCount: 2341, inStock: true,
  },
  {
    id: "2", slug: "apple-watch-series-9", name: "Apple Watch Series 9 GPS + Cellular",
    brand: "Apple", category: "smartwatches", price: 499.99,
    description: "Advanced health features.", images: [],
    variants: [{ id: "v3", name: "Midnight", color: "Midnight", colorHex: "#1d1d1f", inStock: true }],
    specs: { display: "OLED", battery: "18 hours" }, compatibility: ["iOS"],
    rating: 4.7, reviewCount: 1856, inStock: true,
  },
  {
    id: "3", slug: "bose-qc-ultra-earbuds", name: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose", category: "earbuds", price: 299.99,
    description: "World-class noise cancellation.", images: [],
    variants: [{ id: "v5", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true }],
    specs: { driver: "9.3mm", battery: "6 hours" }, compatibility: ["iOS", "Android"],
    rating: 4.6, reviewCount: 987, inStock: true,
  },
  {
    id: "4", slug: "jbl-charge-5", name: "JBL Charge 5 Portable Bluetooth Speaker",
    brand: "JBL", category: "speakers", price: 179.99, compareAtPrice: 199.99,
    description: "Bold sound with powerful bass.", images: [],
    variants: [{ id: "v7", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true }],
    specs: { power: "30W", battery: "20 hours" }, compatibility: ["iOS", "Android"],
    rating: 4.7, reviewCount: 3421, inStock: true,
  },
  {
    id: "5", slug: "sennheiser-momentum-4", name: "Sennheiser Momentum 4 Wireless",
    brand: "Sennheiser", category: "headphones", price: 349.95,
    description: "Superior sound with adaptive noise cancellation.", images: [],
    variants: [{ id: "v10", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true }],
    specs: { driver: "42mm", battery: "60 hours" }, compatibility: ["iOS", "Android", "Windows"],
    rating: 4.5, reviewCount: 1243, inStock: true,
  },
  {
    id: "6", slug: "samsung-galaxy-watch-6", name: "Samsung Galaxy Watch 6 Classic",
    brand: "Samsung", category: "smartwatches", price: 399.99,
    description: "Rotating bezel with advanced fitness tracking.", images: [],
    variants: [{ id: "v11", name: "Silver", color: "Silver", colorHex: "#c0c0c0", inStock: true }],
    specs: { display: "Super AMOLED", battery: "40 hours" }, compatibility: ["Android"],
    rating: 4.4, reviewCount: 876, inStock: true,
  },
];

interface ProductGridProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export function ProductGrid({ searchParams }: ProductGridProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const currentSort = (currentSearchParams.get("sort") || "featured");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: () =>
      api.products.list(
        Object.fromEntries(
          Object.entries(searchParams)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
        ) as Record<string, string>
      ),
    retry: 1,
  });

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
  };

  const products =
    isError || !data ? placeholderProducts : data.products;
  const totalPages =
    isError || !data ? 1 : data.totalPages;
  const currentPage =
    isError || !data ? 1 : data.page;

  return (
    <div>
      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--sonica-text-muted)]">
          {isError || !data
            ? `${placeholderProducts.length} products`
            : `${data.total} product${data.total !== 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-[var(--sonica-text-muted)]" />
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-lg border border-[var(--sonica-border)] bg-[var(--sonica-surface)] px-3 py-1.5 text-sm text-[var(--sonica-text)] focus:border-[var(--sonica-primary)] focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-[var(--sonica-bg)]" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 rounded bg-[var(--sonica-bg)]" />
                <div className="h-4 w-full rounded bg-[var(--sonica-bg)]" />
                <div className="h-6 w-24 rounded bg-[var(--sonica-bg)]" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-[var(--sonica-text-muted)]">
            No products found matching your filters.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 text-sm text-[var(--sonica-primary)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => {
              const params = new URLSearchParams(currentSearchParams.toString());
              params.set("page", String(currentPage - 1));
              router.push(`/products?${params.toString()}`);
            }}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 rounded-lg border border-[var(--sonica-border)] px-3 py-2 text-sm disabled:opacity-40 hover:bg-[var(--sonica-surface)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="text-sm text-[var(--sonica-text-muted)] px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => {
              const params = new URLSearchParams(currentSearchParams.toString());
              params.set("page", String(currentPage + 1));
              router.push(`/products?${params.toString()}`);
            }}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 rounded-lg border border-[var(--sonica-border)] px-3 py-2 text-sm disabled:opacity-40 hover:bg-[var(--sonica-surface)] transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
