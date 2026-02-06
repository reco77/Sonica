"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, GitCompareArrows, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useComparisonStore, type ComparisonProduct } from "@/store/comparison";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleProduct, isInComparison } = useComparisonStore();
  const inComparison = isInComparison(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0] || "",
      slug: product.slug,
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const compProduct: ComparisonProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0] || "",
      slug: product.slug,
      category: product.category,
      specs: product.specs,
    };
    toggleProduct(compProduct);
  };

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] overflow-hidden hover:border-[var(--sonica-primary)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--sonica-primary)]/5"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[var(--sonica-bg)] overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--sonica-text-muted)]">
            <ShoppingCart className="h-12 w-12 opacity-20" />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleCompare}
            className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
              inComparison
                ? "bg-[var(--sonica-primary)] text-white"
                : "bg-black/50 text-white hover:bg-[var(--sonica-primary)]"
            }`}
            title={inComparison ? "Remove from comparison" : "Add to comparison"}
          >
            {inComparison ? (
              <Check className="h-4 w-4" />
            ) : (
              <GitCompareArrows className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--sonica-primary)] py-2.5 text-sm font-medium text-white hover:bg-[var(--sonica-primary-dark)] transition-colors backdrop-blur-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--sonica-accent)]">
          {product.brand}
        </p>
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[var(--sonica-primary)] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-[var(--sonica-border)]"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--sonica-text-muted)]">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-[var(--sonica-text-muted)] line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Compatibility Badges */}
        {product.compatibility && product.compatibility.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {product.compatibility.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-md bg-[var(--sonica-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--sonica-text-muted)] ring-1 ring-[var(--sonica-border)]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
