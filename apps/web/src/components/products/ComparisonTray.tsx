"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, Trash2 } from "lucide-react";
import { useComparisonStore } from "@/store/comparison";

export function ComparisonTray() {
  const { products, isOpen, removeProduct, clearComparison, closeTray } =
    useComparisonStore();

  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--sonica-border)] bg-[var(--sonica-surface)]/95 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Products */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-[var(--sonica-text-muted)] shrink-0">
              Compare ({products.length}/4):
            </span>
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 rounded-lg border border-[var(--sonica-border)] bg-[var(--sonica-bg)] px-3 py-2 shrink-0"
              >
                <div className="relative h-8 w-8 rounded bg-[var(--sonica-surface)] overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--sonica-surface)]" />
                  )}
                </div>
                <span className="text-sm max-w-[120px] truncate">
                  {product.name}
                </span>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-0.5 text-[var(--sonica-text-muted)] hover:text-red-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearComparison}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--sonica-border)] px-3 py-2 text-sm text-[var(--sonica-text-muted)] hover:text-red-400 hover:border-red-400/50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <Link
              href="/compare"
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                products.length >= 2
                  ? "bg-[var(--sonica-primary)] text-white hover:bg-[var(--sonica-primary-dark)]"
                  : "bg-[var(--sonica-surface-hover)] text-[var(--sonica-text-muted)] cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (products.length < 2) e.preventDefault();
              }}
            >
              Compare
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={closeTray}
              className="p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
