"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Package,
} from "lucide-react";
import type { ProductCategory } from "@sonica/shared";
import { PRODUCT_CATEGORIES } from "@sonica/shared";

// ---------------------------------------------------------------------------
// Mock data -- replace with real API calls
// ---------------------------------------------------------------------------

interface MockProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  image: string;
  variants: number;
  totalStock: number;
  priceRange: { min: number; max: number };
  featured: boolean;
}

const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    image: "/placeholder.png",
    variants: 3,
    totalStock: 45,
    priceRange: { min: 34900, max: 39900 },
    featured: true,
  },
  {
    id: "2",
    name: "Apple AirPods Pro 2",
    brand: "Apple",
    category: "earbuds",
    image: "/placeholder.png",
    variants: 1,
    totalStock: 120,
    priceRange: { min: 24900, max: 24900 },
    featured: true,
  },
  {
    id: "3",
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "smartwatch",
    image: "/placeholder.png",
    variants: 4,
    totalStock: 30,
    priceRange: { min: 29900, max: 44900 },
    featured: false,
  },
  {
    id: "4",
    name: "JBL Charge 5",
    brand: "JBL",
    category: "speaker",
    image: "/placeholder.png",
    variants: 6,
    totalStock: 85,
    priceRange: { min: 17900, max: 17900 },
    featured: false,
  },
  {
    id: "5",
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "headphones",
    image: "/placeholder.png",
    variants: 2,
    totalStock: 8,
    priceRange: { min: 42900, max: 42900 },
    featured: true,
  },
  {
    id: "6",
    name: "Jabra Elite 85t",
    brand: "Jabra",
    category: "earbuds",
    image: "/placeholder.png",
    variants: 3,
    totalStock: 0,
    priceRange: { min: 19900, max: 22900 },
    featured: false,
  },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = mockProducts.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-4 pr-10 text-sm text-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <Package className="h-12 w-12 text-zinc-700" />
          <p className="mt-4 text-sm font-medium text-zinc-400">
            No products found
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Brand</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Variants</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Price Range</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                          <Package className="h-5 w-5 text-zinc-500" />
                        </div>
                        <span className="text-sm font-medium text-zinc-200">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                      {product.brand}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                      {product.variants}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.totalStock === 0
                            ? "text-red-400"
                            : product.totalStock <= 10
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                      {product.priceRange.min === product.priceRange.max
                        ? formatPrice(product.priceRange.min)
                        : `${formatPrice(product.priceRange.min)} - ${formatPrice(product.priceRange.max)}`}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {product.totalStock === 0 ? (
                        <span className="inline-flex rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                          Out of Stock
                        </span>
                      ) : product.featured ? (
                        <span className="inline-flex rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
