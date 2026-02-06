"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  ShoppingCart,
  Heart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Package,
  GitCompareArrows,
} from "lucide-react";
import { api, type Product, type ProductVariant } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useComparisonStore, type ComparisonProduct } from "@/store/comparison";
import { VariantPicker } from "@/components/products/VariantPicker";

// Placeholder product for demo
const placeholderProduct: Product = {
  id: "1",
  slug: "sony-wh-1000xm5",
  name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  brand: "Sony",
  category: "headphones",
  price: 349.99,
  compareAtPrice: 399.99,
  description:
    "Experience the next level of silence with the Sony WH-1000XM5. Featuring industry-leading noise cancellation powered by eight microphones and two processors, these headphones deliver exceptional sound quality with a newly designed 30mm driver unit. Ultra-comfortable and lightweight at just 250g, with up to 30 hours of battery life and multipoint connection for seamless switching between devices.",
  images: [],
  variants: [
    { id: "v1", name: "Black", color: "Black", colorHex: "#1a1a1a", inStock: true },
    { id: "v2", name: "Silver", color: "Silver", colorHex: "#c0c0c0", inStock: true },
    { id: "v3", name: "Midnight Blue", color: "Midnight Blue", colorHex: "#191970", inStock: false },
  ],
  specs: {
    "Driver Size": "30mm",
    "Frequency Response": "4Hz - 40,000Hz",
    "Battery Life": "30 hours",
    "Charging Time": "3.5 hours (full), 3 min = 3 hours",
    Bluetooth: "5.2",
    Codecs: "LDAC, AAC, SBC",
    Weight: "250g",
    "Noise Cancellation": "Adaptive",
    Microphones: "8 mics (NC), 4 beamforming (calls)",
    "Multipoint Connection": "Yes",
    "Foldable Design": "No (flat fold)",
    "USB-C Charging": "Yes",
  },
  compatibility: ["iOS", "Android", "Windows", "macOS", "PlayStation"],
  rating: 4.8,
  reviewCount: 2341,
  inStock: true,
};

const crossSellProducts = [
  { id: "cs1", name: "Premium Carrying Case", price: 29.99, slug: "premium-case" },
  { id: "cs2", name: "USB-C Charging Cable (6ft)", price: 14.99, slug: "usb-c-cable" },
  { id: "cs3", name: "Replacement Ear Pads", price: 24.99, slug: "ear-pads" },
];

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleProduct, isInComparison } = useComparisonStore();

  const { data: product, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.products.getBySlug(slug),
    retry: 1,
  });

  const p = isError || !product ? placeholderProduct : product;
  const currentVariant = selectedVariant || p.variants[0] || null;

  const inComparison = isInComparison(p.id);

  const handleAddToCart = () => {
    addItem({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: currentVariant?.price ?? p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.images[0] || "",
      slug: p.slug,
      variant: currentVariant?.id,
      color: currentVariant?.name,
    });
  };

  const handleToggleCompare = () => {
    const compProduct: ComparisonProduct = {
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.images[0] || "",
      slug: p.slug,
      category: p.category,
      specs: p.specs,
    };
    toggleProduct(compProduct);
  };

  const discount = p.compareAtPrice
    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--sonica-text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--sonica-text)] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-[var(--sonica-text)] transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/products?category=${p.category}`}
          className="hover:text-[var(--sonica-text)] transition-colors capitalize"
        >
          {p.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[var(--sonica-text)] truncate max-w-[200px]">{p.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl bg-[var(--sonica-surface)] border border-[var(--sonica-border)] overflow-hidden">
            {p.images[activeImageIndex] ? (
              <Image
                src={p.images[activeImageIndex]}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-24 w-24 text-[var(--sonica-border)]" />
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnail Grid */}
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImageIndex
                      ? "border-[var(--sonica-primary)]"
                      : "border-[var(--sonica-border)] hover:border-[var(--sonica-text-muted)]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${p.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Name */}
          <div>
            <Link
              href={`/products?brand=${p.brand.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-[var(--sonica-accent)] hover:underline"
            >
              {p.brand}
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold mt-1">{p.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(p.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-[var(--sonica-border)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{p.rating}</span>
            <span className="text-sm text-[var(--sonica-text-muted)]">
              ({p.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              ${(currentVariant?.price ?? p.price).toFixed(2)}
            </span>
            {p.compareAtPrice && (
              <>
                <span className="text-lg text-[var(--sonica-text-muted)] line-through">
                  ${p.compareAtPrice.toFixed(2)}
                </span>
                <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-sm font-semibold text-red-400">
                  Save ${(p.compareAtPrice - p.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-[var(--sonica-text-muted)] leading-relaxed">
            {p.description}
          </p>

          {/* Variant Picker */}
          {p.variants.length > 0 && (
            <VariantPicker
              variants={p.variants}
              selectedVariantId={currentVariant?.id || null}
              onSelect={setSelectedVariant}
            />
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-[var(--sonica-border)]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!p.inStock}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--sonica-primary)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--sonica-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--sonica-primary)]/25"
            >
              <ShoppingCart className="h-4 w-4" />
              {p.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              onClick={handleToggleCompare}
              className={`p-3 rounded-xl border transition-colors ${
                inComparison
                  ? "border-[var(--sonica-primary)] bg-[var(--sonica-primary)]/10 text-[var(--sonica-primary)]"
                  : "border-[var(--sonica-border)] text-[var(--sonica-text-muted)] hover:text-[var(--sonica-primary)] hover:border-[var(--sonica-primary)]/30"
              }`}
              title={inComparison ? "Remove from comparison" : "Add to comparison"}
            >
              {inComparison ? <Check className="h-5 w-5" /> : <GitCompareArrows className="h-5 w-5" />}
            </button>
            <button className="p-3 rounded-xl border border-[var(--sonica-border)] text-[var(--sonica-text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {p.inStock ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">In Stock</span>
              </>
            ) : (
              <span className="text-sm text-red-400 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--sonica-border)] p-3 text-center">
              <Truck className="h-5 w-5 text-[var(--sonica-accent)]" />
              <span className="text-xs text-[var(--sonica-text-muted)]">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--sonica-border)] p-3 text-center">
              <Shield className="h-5 w-5 text-[var(--sonica-accent)]" />
              <span className="text-xs text-[var(--sonica-text-muted)]">2-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--sonica-border)] p-3 text-center">
              <RotateCcw className="h-5 w-5 text-[var(--sonica-accent)]" />
              <span className="text-xs text-[var(--sonica-text-muted)]">30-Day Returns</span>
            </div>
          </div>

          {/* Compatibility Badges */}
          {p.compatibility.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Compatible with</h3>
              <div className="flex flex-wrap gap-2">
                {p.compatibility.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sonica-surface)] border border-[var(--sonica-border)] px-3 py-1.5 text-xs font-medium text-[var(--sonica-text-muted)]"
                  >
                    <Check className="h-3 w-3 text-emerald-400" />
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spec Table */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <div className="rounded-xl border border-[var(--sonica-border)] overflow-hidden">
          <table className="w-full">
            <tbody>
              {Object.entries(p.specs).map(([key, value], i) => (
                <tr
                  key={key}
                  className={i % 2 === 0 ? "bg-[var(--sonica-surface)]" : "bg-[var(--sonica-bg)]"}
                >
                  <td className="px-6 py-3 text-sm font-medium text-[var(--sonica-text-muted)] w-1/3">
                    {key}
                  </td>
                  <td className="px-6 py-3 text-sm">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews Section Placeholder */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <button className="rounded-lg border border-[var(--sonica-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--sonica-surface)] transition-colors">
            Write a Review
          </button>
        </div>
        <div className="rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-8 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(p.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-[var(--sonica-border)]"
                }`}
              />
            ))}
          </div>
          <p className="text-2xl font-bold">{p.rating} out of 5</p>
          <p className="text-sm text-[var(--sonica-text-muted)] mt-1">
            Based on {p.reviewCount.toLocaleString()} reviews
          </p>
        </div>
      </section>

      {/* Cross-sell Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Complete Your Setup</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {crossSellProducts.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-4 hover:border-[var(--sonica-primary)]/50 transition-colors"
            >
              <div className="h-16 w-16 rounded-lg bg-[var(--sonica-bg)] flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-[var(--sonica-border)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-sm font-bold mt-0.5">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: item.id,
                    name: item.name,
                    brand: p.brand,
                    price: item.price,
                    image: "",
                    slug: item.slug,
                  });
                }}
                className="shrink-0 rounded-lg bg-[var(--sonica-primary)] p-2 text-white hover:bg-[var(--sonica-primary-dark)] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
