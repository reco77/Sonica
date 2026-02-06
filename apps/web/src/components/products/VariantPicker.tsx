"use client";

import { Check } from "lucide-react";
import type { ProductVariant } from "@/lib/api";

interface VariantPickerProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantPicker({
  variants,
  selectedVariantId,
  onSelect,
}: VariantPickerProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">
        Color:{" "}
        <span className="text-[var(--sonica-text-muted)]">
          {variants.find((v) => v.id === selectedVariantId)?.name || "Select"}
        </span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = !variant.inStock;

          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              disabled={isOutOfStock}
              title={`${variant.name}${isOutOfStock ? " (Out of stock)" : ""}`}
              className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                isSelected
                  ? "border-[var(--sonica-primary)] ring-2 ring-[var(--sonica-primary)]/30 scale-110"
                  : "border-[var(--sonica-border)] hover:border-[var(--sonica-text-muted)]"
              } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: variant.colorHex }}
              />
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className="h-4 w-4"
                    style={{
                      color: isLightColor(variant.colorHex)
                        ? "#000"
                        : "#fff",
                    }}
                  />
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="block h-px w-8 rotate-45 bg-red-500" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const color = hex.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
