import React from "react";

export interface RatingStarsProps {
  /** Rating value between 0 and 5 */
  rating: number;
  /** Maximum number of stars (default: 5) */
  max?: number;
  /** Size of each star in pixels (default: 20) */
  size?: number;
  /** Whether to display the numeric rating alongside the stars */
  showValue?: boolean;
  className?: string;
}

function StarIcon({
  fill,
  size,
}: {
  fill: "full" | "half" | "empty";
  size: number;
}) {
  const color = fill === "empty" ? "#D1D5DB" : "#F59E0B";

  if (fill === "half") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#halfStar)"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/**
 * Renders a star-based rating display. Supports full, half, and empty stars.
 */
export function RatingStars({
  rating,
  max = 5,
  size = 20,
  showValue = false,
  className,
}: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(rating, max));

  const stars: Array<"full" | "half" | "empty"> = [];
  for (let i = 1; i <= max; i++) {
    if (clamped >= i) {
      stars.push("full");
    } else if (clamped >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }

  return (
    <span
      className={className}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of ${max} stars`}
      style={{ display: "inline-flex", alignItems: "center", gap: 2 }}
    >
      {stars.map((fill, idx) => (
        <StarIcon key={idx} fill={fill} size={size} />
      ))}
      {showValue && (
        <span style={{ marginLeft: 4, fontSize: size * 0.7 }}>
          {clamped.toFixed(1)}
        </span>
      )}
    </span>
  );
}
