"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Package,
  Loader2,
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "@sonica/shared";
import { getProducts, deleteProduct } from "../../lib/api";
import type { ApiProduct } from "../../lib/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function priceRange(variants: ApiProduct["variants"]): { min: number; max: number } {
  if (!variants || variants.length === 0) return { min: 0, max: 0 };
  const prices = variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function totalStock(variants: ApiProduct["variants"]): number {
  if (!variants) return 0;
  return variants.reduce((sum, v) => sum + v.stock, 0);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", categoryFilter, page],
    queryFn: () =>
      getProducts({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        page,
        limit: 20,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeletingId(null);
    },
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  // Client-side search filter (API doesn't have a search param for name)
  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      // Second click confirms
      deleteMutation.mutate(id);
    } else {
      setDeletingId(id);
      // Auto-reset after 3 seconds
      setTimeout(() => setDeletingId((cur) => (cur === id ? null : cur)), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your product catalog
            {pagination ? ` (${pagination.total} total)` : ""}
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
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
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

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          Failed to load products: {(error as Error).message}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : filtered.length === 0 ? (
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
                {filtered.map((product) => {
                  const range = priceRange(product.variants);
                  const stock = totalStock(product.variants);
                  const heroImage = product.images?.find(
                    (img) => img.type === "HERO",
                  );
                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-zinc-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          {heroImage ? (
                            <img
                              src={heroImage.url}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                              <Package className="h-5 w-5 text-zinc-500" />
                            </div>
                          )}
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
                          {product.category.toLowerCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                        {product.variants?.length ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            stock === 0
                              ? "text-red-400"
                              : stock <= 10
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }`}
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                        {range.min === range.max
                          ? formatPrice(range.min)
                          : `${formatPrice(range.min)} - ${formatPrice(range.max)}`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {stock === 0 ? (
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
                          <Link
                            href={`/products/${product.slug}`}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteMutation.isPending}
                            className={`rounded-lg p-1.5 transition-colors ${
                              deletingId === product.id
                                ? "bg-red-500/20 text-red-400"
                                : "text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                            }`}
                            title={
                              deletingId === product.id
                                ? "Click again to confirm"
                                : "Delete product"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {deletingId === product.id && (
                            <span className="text-xs text-red-400">
                              Confirm?
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-3">
              <p className="text-sm text-zinc-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} products)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
