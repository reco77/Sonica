"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  Package,
  Lock,
} from "lucide-react";
import { useCartStore, useCartSubtotal, useCartItemCount } from "@/store/cart";

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const itemCount = useCartItemCount();

  const shipping = subtotal >= 99 ? 0 : 9.99;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <ShoppingBag className="h-20 w-20 text-[var(--sonica-border)]" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-[var(--sonica-text-muted)] text-center max-w-md">
          Looks like you haven&apos;t added any items to your cart yet. Browse
          our products and find something you love.
        </p>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--sonica-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--sonica-primary-dark)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--sonica-border)]">
          <p className="text-sm text-[var(--sonica-text-muted)]">
            {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
          </p>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Items List */}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={`${item.id}-${item.variant || ""}`}
              className="flex gap-4 sm:gap-6 rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-4 sm:p-6"
            >
              {/* Image */}
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg bg-[var(--sonica-bg)] overflow-hidden shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-8 w-8 text-[var(--sonica-border)]" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-[var(--sonica-accent)] font-medium">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm sm:text-base font-medium hover:text-[var(--sonica-primary)] transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.color && (
                      <p className="text-xs text-[var(--sonica-text-muted)] mt-0.5">
                        Color: {item.color}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.variant)}
                    className="p-1.5 text-[var(--sonica-text-muted)] hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 rounded-lg border border-[var(--sonica-border)]">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1, item.variant)
                      }
                      className="p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1, item.variant)
                      }
                      className="p-2 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    {item.compareAtPrice && (
                      <p className="text-xs text-[var(--sonica-text-muted)] line-through">
                        ${(item.compareAtPrice * item.quantity).toFixed(2)}
                      </p>
                    )}
                    <p className="text-lg font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-[var(--sonica-text-muted)]">
                        ${item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Continue Shopping */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-[var(--sonica-primary)] hover:text-[var(--sonica-accent)] transition-colors mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-[var(--sonica-border)] bg-[var(--sonica-surface)] p-6 space-y-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          {/* Promo Code */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sonica-text-muted)]" />
              <input
                type="text"
                placeholder="Promo code"
                className="w-full rounded-lg border border-[var(--sonica-border)] bg-[var(--sonica-bg)] py-2.5 pl-10 pr-3 text-sm placeholder:text-[var(--sonica-text-muted)] focus:border-[var(--sonica-primary)] focus:outline-none"
              />
            </div>
            <button className="rounded-lg border border-[var(--sonica-border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--sonica-surface-hover)] transition-colors">
              Apply
            </button>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--sonica-text-muted)]">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--sonica-text-muted)]">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-emerald-400">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--sonica-text-muted)]">
                Estimated Tax
              </span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-[var(--sonica-accent)]">
                Add ${(99 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
          </div>

          <div className="border-t border-[var(--sonica-border)] pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--sonica-primary)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--sonica-primary-dark)] transition-colors shadow-lg shadow-[var(--sonica-primary)]/25">
            <Lock className="h-4 w-4" />
            Proceed to Checkout
          </button>

          <p className="text-xs text-center text-[var(--sonica-text-muted)]">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
