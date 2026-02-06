// ---------------------------------------------------------------------------
// Product Categories
// ---------------------------------------------------------------------------

export const PRODUCT_CATEGORY_VALUES = [
  "headphones",
  "smartwatch",
  "earbuds",
  "speaker",
  "accessory",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY_VALUES)[number];

// ---------------------------------------------------------------------------
// Per-Category Specifications
// ---------------------------------------------------------------------------

export interface HeadphoneSpecs {
  driverSize: number; // mm
  frequencyRange: { min: number; max: number }; // Hz
  impedance: number; // Ohms
  sensitivity: number; // dB
  noiseCancellation: boolean;
  codecs: string[];
  cableLength?: number; // metres
}

export interface SmartwatchSpecs {
  displaySize: number; // inches
  displayType: string; // e.g. "AMOLED", "LCD"
  os: string; // e.g. "watchOS", "Wear OS"
  sensors: string[];
  gps: boolean;
  waterRating: string; // e.g. "IP68", "5ATM"
  strapWidth: number; // mm
}

export interface EarbudsSpecs {
  driverSize: number; // mm
  ancLevel: "none" | "basic" | "advanced";
  transparencyMode: boolean;
  stemDesign: "stem" | "stemless";
}

export interface SpeakerSpecs {
  wattage: number; // W
  driverCount: number;
  batteryLife: number; // hours
  waterRating: string; // e.g. "IP67"
}

export type ProductSpecs =
  | HeadphoneSpecs
  | SmartwatchSpecs
  | EarbudsSpecs
  | SpeakerSpecs;

// ---------------------------------------------------------------------------
// Connectivity & Battery
// ---------------------------------------------------------------------------

export interface Connectivity {
  bluetoothVersion?: string; // e.g. "5.3"
  wifi?: boolean;
  usbC?: boolean;
  auxJack?: boolean;
}

export interface BatteryLife {
  hours: number;
  chargingTimeMinutes: number;
  wirelessCharging: boolean;
}

// ---------------------------------------------------------------------------
// Product Variants
// ---------------------------------------------------------------------------

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string; // e.g. "#1A1A1A"
  edition?: string; // e.g. "Limited Edition"
  sku: string;
  price: number; // cents
  compareAtPrice?: number; // cents
  stock: number;
}

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  specs: ProductSpecs;
  connectivity: Connectivity;
  batteryLife?: BatteryLife;
  compatibility: string[];
  variants: ProductVariant[];
  images: string[];
  documents?: string[];
  releaseDate: string; // ISO 8601
  featured: boolean;
  averageRating?: number;
  reviewCount?: number;
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number; // cents
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Warranty {
  type: "standard" | "extended";
  durationMonths: number;
  expiresAt: string; // ISO 8601
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  warranty?: Warranty;
  subtotal: number; // cents
  tax: number; // cents
  shippingCost: number; // cents
  total: number; // cents
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface ReviewRatings {
  overall: number; // 1-5
  soundQuality?: number; // 1-5
  comfort?: number; // 1-5
  battery?: number; // 1-5
  buildQuality?: number; // 1-5
  value?: number; // 1-5
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  ratings: ReviewRatings;
  title: string;
  body: string;
  pros?: string[];
  cons?: string[];
  verifiedPurchase: boolean;
  deviceUsedWith?: string;
  helpfulCount: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
