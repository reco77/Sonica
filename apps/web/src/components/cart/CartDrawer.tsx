"use client";

import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cart";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } =
    useCartStore();
  const subtotal = useCartSubtotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[var(--sonica-bg)] border-l border-[var(--sonica-border)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--sonica-border)] px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[var(--sonica-primary)]" />
            <h2 className="text-lg font-semibold">Cart</h2>
            <span className="text-sm text-[var(--sonica-text-muted)]">
              ({items.length} item{items.length !== 1 ? "s" : ""})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] hover:bg-[var(--sonica-surface)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
              <ShoppingBag className="h-16 w-16 text-[var(--sonica-border)]" />
              <p className="text-[var(--sonica-text-muted)] text-center">
                Your cart is empty
              </p>
              <button
                onClick={closeCart}
                className="rounded-lg bg-[var(--sonica-primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--sonica-primary-dark)] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--sonica-border)]">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.variant || ""}`}
                  className="flex gap-4 px-6 py-4"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 rounded-lg bg-[var(--sonica-surface)] overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-6 w-6 text-[var(--sonica-border)]" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--sonica-accent)] font-medium">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium line-clamp-1 hover:text-[var(--sonica-primary)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.color && (
                      <p className="text-xs text-[var(--sonica-text-muted)] mt-0.5">
                        {item.color}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 rounded-lg border border-[var(--sonica-border)]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.variant
                            )
                          }
                          className="p-1.5 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.variant
                            )
                          }
                          className="p-1.5 text-[var(--sonica-text-muted)] hover:text-[var(--sonica-text)] transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.variant)}
                          className="p-1 text-[var(--sonica-text-muted)] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--sonica-border)] px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--sonica-text-muted)]">
                Subtotal
              </span>
              <span className="text-lg font-bold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[var(--sonica-text-muted)]">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--sonica-border)] py-2.5 text-sm font-medium hover:bg-[var(--sonica-surface)] transition-colors"
              >
                View Cart
              </Link>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--sonica-primary)] py-2.5 text-sm font-medium text-white hover:bg-[var(--sonica-primary-dark)] transition-colors">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
