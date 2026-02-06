import type { ProductCategory } from "./types";

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export const BRANDS: string[] = [
  "Sony",
  "Apple",
  "Samsung",
  "Bose",
  "Sennheiser",
  "JBL",
  "Jabra",
  "Beats",
  "Bang & Olufsen",
  "Garmin",
  "Fitbit",
  "Google",
];

// ---------------------------------------------------------------------------
// Product Categories
// ---------------------------------------------------------------------------

export interface CategoryInfo {
  value: ProductCategory;
  label: string;
  icon: string; // emoji or icon name
}

export const PRODUCT_CATEGORIES: CategoryInfo[] = [
  { value: "headphones", label: "Headphones", icon: "headphones" },
  { value: "smartwatch", label: "Smartwatches", icon: "watch" },
  { value: "earbuds", label: "Earbuds", icon: "earbuds" },
  { value: "speaker", label: "Speakers", icon: "speaker" },
  { value: "accessory", label: "Accessories", icon: "cable" },
];

// ---------------------------------------------------------------------------
// Connectivity Options
// ---------------------------------------------------------------------------

export interface ConnectivityOption {
  value: string;
  label: string;
}

export const CONNECTIVITY_OPTIONS: ConnectivityOption[] = [
  { value: "bluetooth", label: "Bluetooth" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "usb-c", label: "USB-C" },
  { value: "aux", label: "3.5 mm Aux" },
  { value: "nfc", label: "NFC" },
  { value: "multipoint", label: "Multipoint" },
];

// ---------------------------------------------------------------------------
// Compatibility Options
// ---------------------------------------------------------------------------

export const COMPATIBILITY_OPTIONS: string[] = [
  "iOS",
  "Android",
  "Windows",
  "macOS",
  "PS5",
  "Xbox",
  "Nintendo Switch",
];

// ---------------------------------------------------------------------------
// Sort Options
// ---------------------------------------------------------------------------

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "top-rated", label: "Top Rated" },
  { value: "best-selling", label: "Best Selling" },
];

// ---------------------------------------------------------------------------
// Price Ranges (in cents)
// ---------------------------------------------------------------------------

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: "Under $50", min: 0, max: 5000 },
  { label: "$50 – $100", min: 5000, max: 10000 },
  { label: "$100 – $200", min: 10000, max: 20000 },
  { label: "$200 – $500", min: 20000, max: 50000 },
  { label: "$500+", min: 50000, max: Infinity },
];

// ---------------------------------------------------------------------------
// Battery Ranges
// ---------------------------------------------------------------------------

export interface BatteryRange {
  label: string;
  minHours: number;
}

export const BATTERY_RANGES: BatteryRange[] = [
  { label: "5+ hours", minHours: 5 },
  { label: "10+ hours", minHours: 10 },
  { label: "20+ hours", minHours: 20 },
  { label: "30+ hours", minHours: 30 },
  { label: "50+ hours", minHours: 50 },
];
