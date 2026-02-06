import React from "react";

export interface PriceDisplayProps {
  /** Price in cents */
  price: number;
  /** Original / compare-at price in cents (shown with strikethrough) */
  compareAtPrice?: number;
  /** ISO 4217 currency code (default: "USD") */
  currency?: string;
  /** BCP 47 locale string (default: "en-US") */
  locale?: string;
  className?: string;
}

/**
 * Formats a price from cents and optionally shows a compare-at price with
 * strikethrough styling.
 */
export function PriceDisplay({
  price,
  compareAtPrice,
  currency = "USD",
  locale = "en-US",
  className,
}: PriceDisplayProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(cents / 100);

  const hasDiscount =
    compareAtPrice != null && compareAtPrice > price;

  return (
    <span className={className}>
      {hasDiscount && (
        <span
          style={{ textDecoration: "line-through", opacity: 0.6 }}
          aria-label={`Original price ${fmt(compareAtPrice!)}`}
        >
          {fmt(compareAtPrice!)}
        </span>
      )}
      {hasDiscount && " "}
      <span
        aria-label={`Current price ${fmt(price)}`}
        style={hasDiscount ? { color: "var(--color-sale, #e53e3e)" } : undefined}
      >
        {fmt(price)}
      </span>
    </span>
  );
}
