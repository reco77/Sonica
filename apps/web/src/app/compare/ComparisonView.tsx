"use client";

import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingCart,
  Star,
  Package,
  Plus,
  GitCompareArrows,
} from "lucide-react";
import { useComparisonStore } from "@/store/comparison";
import { useCartStore } from "@/store/cart";

export function ComparisonView() {
  const { products, removeProduct, clearComparison } = useComparisonStore();
  const addItem = useCartStore((s) => s.addItem);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <GitCompareArrows className="h-16 w-16 text-[var(--sonica-border)]" />
        <h2 className="text-xl font-semibold">No products to compare</h2>
        <p className="text-[var(--sonica-text-muted)] text-center max-w-md">
          Browse products and click the compare icon to add items for
          side-by-side comparison. You can compare up to 4 products at once.
        </p>
        <Link
          href="/products"
          className="mt-2 rounded-xl bg-[var(--sonica-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--sonica-primary-dark)] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Collect all unique spec keys across all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs)))
  );

  // Check if a spec value differs across products
  const specsDiffer = (key: string): boolean => {
    const values = products.map((p) => String(p.specs[key] ?? "N/A"));
    return new Set(values).size > 1;
  };

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      slug: product.slug,
    });
  };

  return (
    <div>
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--sonica-text-muted)]">
          Comparing {products.length} product{products.length !== 1 ? "s" : ""}{" "}
          (max 4)
        </p>
        <button
          onClick={clearComparison}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {/* Product Cards Header */}
          <thead>
            <tr>
              <th className="w-48 p-3 text-left text-sm font-medium text-[var(--sonica-text-muted)] align-top">
                Product
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="p-3 align-top"
                  style={{ width: `${100 / (products.length + 1)}%` }}
                >
                  <div className="relative rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-4">
                    {/* Remove button */}
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 p-1 rounded-lg text-[var(--sonica-text-muted)] hover:text-red-400 hover:bg-[var(--sonica-bg)] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Image */}
                    <div className="relative aspect-square rounded-lg bg-[var(--sonica-bg)] mb-3 overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-10 w-10 text-[var(--sonica-border)]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <p className="text-xs text-[var(--sonica-accent)] font-medium">
                      {product.brand}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-medium hover:text-[var(--sonica-primary)] transition-colors line-clamp-2 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    <p className="text-lg font-bold mt-2">
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--sonica-primary)] py-2 text-sm font-medium text-white hover:bg-[var(--sonica-primary-dark)] transition-colors"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}

              {/* Add Product Slot */}
              {products.length < 4 && (
                <th
                  className="p-3 align-top"
                  style={{ width: `${100 / (products.length + 1)}%` }}
                >
                  <Link
                    href="/products"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--sonica-border)] p-8 h-full min-h-[200px] hover:border-[var(--sonica-primary)]/50 hover:bg-[var(--sonica-surface)] transition-colors group"
                  >
                    <Plus className="h-8 w-8 text-[var(--sonica-text-muted)] group-hover:text-[var(--sonica-primary)] transition-colors" />
                    <span className="mt-2 text-sm text-[var(--sonica-text-muted)] group-hover:text-[var(--sonica-primary)] transition-colors">
                      Add Product
                    </span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>

          {/* Specs Comparison */}
          <tbody>
            {/* Category Row */}
            <tr className="border-t border-[var(--sonica-border)]">
              <td className="px-3 py-2.5 text-sm font-medium text-[var(--sonica-text-muted)]">
                Category
              </td>
              {products.map((product) => (
                <td
                  key={product.id}
                  className="px-3 py-2.5 text-sm capitalize"
                >
                  {product.category}
                </td>
              ))}
              {products.length < 4 && <td />}
            </tr>

            {/* Spec Rows */}
            {allSpecKeys.map((key, i) => {
              const differs = specsDiffer(key);
              return (
                <tr
                  key={key}
                  className={`border-t border-[var(--sonica-border)] ${
                    i % 2 === 0 ? "bg-[var(--sonica-surface)]/50" : ""
                  }`}
                >
                  <td className="px-3 py-2.5 text-sm font-medium text-[var(--sonica-text-muted)]">
                    {key}
                  </td>
                  {products.map((product) => {
                    const value = product.specs[key];
                    return (
                      <td
                        key={product.id}
                        className={`px-3 py-2.5 text-sm ${
                          differs
                            ? "text-[var(--sonica-accent)] font-medium"
                            : ""
                        }`}
                      >
                        {value !== undefined ? String(value) : (
                          <span className="text-[var(--sonica-text-muted)]">
                            N/A
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {products.length < 4 && <td />}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
