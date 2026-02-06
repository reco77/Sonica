import React from "react";

export interface CompatibilityBadgesProps {
  /** List of platform strings, e.g. ["iOS", "Android", "Windows"] */
  platforms: string[];
  className?: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  iOS: "iOS",
  Android: "Android",
  Windows: "Windows",
  macOS: "macOS",
  PS5: "PS5",
  Xbox: "Xbox",
  "Nintendo Switch": "Switch",
};

const PLATFORM_COLORS: Record<string, string> = {
  iOS: "#007AFF",
  Android: "#3DDC84",
  Windows: "#0078D4",
  macOS: "#333333",
  PS5: "#003791",
  Xbox: "#107C10",
  "Nintendo Switch": "#E60012",
};

const badgeStyle = (platform: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  color: "#ffffff",
  backgroundColor: PLATFORM_COLORS[platform] ?? "#6B7280",
});

/**
 * Displays compatibility platform badges with color-coding.
 */
export function CompatibilityBadges({
  platforms,
  className,
}: CompatibilityBadgesProps) {
  if (platforms.length === 0) return null;

  return (
    <span
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}
    >
      {platforms.map((platform) => (
        <span key={platform} style={badgeStyle(platform)}>
          {PLATFORM_LABELS[platform] ?? platform}
        </span>
      ))}
    </span>
  );
}
