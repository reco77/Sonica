import { z } from "zod";

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

export const productCategorySchema = z.enum([
  "headphones",
  "smartwatch",
  "earbuds",
  "speaker",
  "accessory",
]);

// ---------------------------------------------------------------------------
// Per-Category Specs
// ---------------------------------------------------------------------------

export const headphoneSpecsSchema = z.object({
  driverSize: z.number().positive(),
  frequencyRange: z.object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  }),
  impedance: z.number().positive(),
  sensitivity: z.number().positive(),
  noiseCancellation: z.boolean(),
  codecs: z.array(z.string().min(1)),
  cableLength: z.number().positive().optional(),
});

export const smartwatchSpecsSchema = z.object({
  displaySize: z.number().positive(),
  displayType: z.string().min(1),
  os: z.string().min(1),
  sensors: z.array(z.string().min(1)),
  gps: z.boolean(),
  waterRating: z.string().min(1),
  strapWidth: z.number().positive(),
});

export const earbudsSpecsSchema = z.object({
  driverSize: z.number().positive(),
  ancLevel: z.enum(["none", "basic", "advanced"]),
  transparencyMode: z.boolean(),
  stemDesign: z.enum(["stem", "stemless"]),
});

export const speakerSpecsSchema = z.object({
  wattage: z.number().positive(),
  driverCount: z.number().int().positive(),
  batteryLife: z.number().positive(),
  waterRating: z.string().min(1),
});

export const productSpecsSchema = z.union([
  headphoneSpecsSchema,
  smartwatchSpecsSchema,
  earbudsSpecsSchema,
  speakerSpecsSchema,
]);

// ---------------------------------------------------------------------------
// Connectivity & Battery
// ---------------------------------------------------------------------------

export const connectivitySchema = z.object({
  bluetoothVersion: z.string().optional(),
  wifi: z.boolean().optional(),
  usbC: z.boolean().optional(),
  auxJack: z.boolean().optional(),
});

export const batteryLifeSchema = z.object({
  hours: z.number().nonnegative(),
  chargingTimeMinutes: z.number().nonnegative(),
  wirelessCharging: z.boolean(),
});

// ---------------------------------------------------------------------------
// Product Variant
// ---------------------------------------------------------------------------

export const productVariantSchema = z.object({
  id: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  edition: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
});

// ---------------------------------------------------------------------------
// Create Product (API validation)
// ---------------------------------------------------------------------------

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  brand: z.string().min(1).max(100),
  tagline: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  category: productCategorySchema,
  specs: productSpecsSchema,
  connectivity: connectivitySchema,
  batteryLife: batteryLifeSchema.optional(),
  compatibility: z.array(z.string().min(1)),
  variants: z.array(productVariantSchema).min(1),
  images: z.array(z.string().url()).min(1),
  documents: z.array(z.string().url()).optional(),
  releaseDate: z.string().datetime(),
  featured: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const reviewRatingsSchema = z.object({
  overall: z.number().int().min(1).max(5),
  soundQuality: z.number().int().min(1).max(5).optional(),
  comfort: z.number().int().min(1).max(5).optional(),
  battery: z.number().int().min(1).max(5).optional(),
  buildQuality: z.number().int().min(1).max(5).optional(),
  value: z.number().int().min(1).max(5).optional(),
});

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  ratings: reviewRatingsSchema,
  title: z.string().min(1).max(200),
  body: z.string().min(10).max(5000),
  pros: z.array(z.string().min(1)).optional(),
  cons: z.array(z.string().min(1)).optional(),
  verifiedPurchase: z.boolean().default(false),
  deviceUsedWith: z.string().max(100).optional(),
});

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1).max(200),
  line1: z.string().min(1).max(300),
  line2: z.string().max(300).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1),
  priceAtPurchase: z.number().int().nonnegative(),
});

export const warrantySchema = z.object({
  type: z.enum(["standard", "extended"]),
  durationMonths: z.number().int().positive(),
  expiresAt: z.string().datetime(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  warranty: warrantySchema.optional(),
});
