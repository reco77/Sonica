# Sonica — Tech Accessories E-Commerce Stack

> Specialized for headphones, smartwatches, earbuds, speakers, and wearable tech.

## Frontend

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js (React) | SSR for product SEO, ISR for spec pages, image optimization for high-res product shots |
| **Language** | TypeScript | Type-safe product specs, variant models, compatibility matrices |
| **Styling** | Tailwind CSS | Dark/sleek tech aesthetic, responsive grid layouts for product cards |
| **State Management** | Zustand | Cart state, comparison tray, recently viewed products |
| **Data Fetching** | TanStack Query | Cached product listings, infinite scroll, real-time stock status |
| **Payments UI** | Stripe Elements | PCI-compliant checkout with Apple Pay / Google Pay (key for tech-savvy buyers) |
| **Forms** | React Hook Form + Zod | Checkout, device compatibility quiz, warranty registration |
| **3D/Media** | React Three Fiber or Spline | Interactive 3D product views for headphones and watches |
| **Animations** | Framer Motion | Smooth product transitions, comparison slider, add-to-cart feedback |

### Tech-Accessories-Specific UI Features
- **Product comparison tool** — side-by-side specs (driver size, battery life, water rating)
- **Compatibility checker** — "Works with: iPhone, Android, Windows, Mac" filter system
- **360° product viewer** — rotatable high-res images or 3D models
- **Spec sheet component** — structured display of frequency response, impedance, weight, etc.
- **Color/variant picker** — visual swatches for colorways (Midnight Black, Arctic White, etc.)
- **"Complete your setup" section** — cross-sell matching accessories (cases, bands, cables)

## Backend

| Layer | Technology | Rationale |
|---|---|---|
| **Runtime** | Node.js + Fastify | High performance, shared TS with frontend |
| **Language** | TypeScript | Shared product spec types, validation schemas |
| **Database** | PostgreSQL | Relational product data, variant/SKU management, order transactions |
| **ORM** | Prisma | Type-safe queries, JSON fields for flexible spec storage |
| **Auth** | NextAuth.js or Clerk | OAuth (Google, Apple), guest checkout support |
| **Payments** | Stripe SDK | Subscriptions (warranty plans), one-time purchases, refunds |
| **File Storage** | Cloudflare R2 or AWS S3 | High-res product photos, 3D assets, manuals/PDFs |
| **Search** | Meilisearch | Faceted filtering by brand, type, price, specs, compatibility |
| **Email** | Resend | Order confirmation, shipping updates, back-in-stock alerts |
| **Job Queue** | BullMQ (Redis) | Inventory sync, price monitoring, review moderation |
| **Cache** | Redis | Product page caching, session storage, rate limiting |

### Tech-Accessories-Specific Backend Features
- **Structured spec engine** — store and query specs as typed JSON (driver size, battery mAh, Bluetooth version, IP rating)
- **Compatibility matrix API** — query which products work with which devices/OS
- **Inventory variant system** — SKU per color × size × edition (e.g., WH-1000XM5 / Silver / International)
- **Price tracking** — historical price data for "price drop alerts"
- **Warranty management** — registration, claims, extended warranty purchases
- **Review system with verification** — verified purchase badges, photo/video reviews, rating by category (sound quality, comfort, battery, build)

## Infrastructure

| Concern | Technology |
|---|---|
| **FE Hosting** | Vercel (edge functions for geo-based pricing/availability) |
| **BE Hosting** | Railway or Fly.io |
| **CDN** | Cloudflare (fast image delivery worldwide) |
| **CI/CD** | GitHub Actions |
| **Containerization** | Docker + Docker Compose |
| **Error Monitoring** | Sentry |
| **Analytics** | PostHog (funnels: browse → compare → cart → checkout) |
| **Logging** | Pino (structured JSON logs) |

## Architecture

### Monorepo with Turborepo
```
apps/
  web/              # Next.js storefront
  api/              # Fastify REST API
  admin/            # Admin dashboard (inventory, orders, specs)
packages/
  shared/           # Shared types, Zod schemas, constants
  product-specs/    # Spec definitions per category (headphones, watches, speakers)
  ui/               # Shared UI components (spec tables, comparison cards)
  config/           # ESLint, TS configs
```

### Data Models (Tech Accessories Focus)

```
Product
  ├── id, name, slug, brand, tagline
  ├── category (headphones | smartwatch | earbuds | speaker | accessory)
  ├── specs (JSON) ─── per-category structured specs
  │     Headphones: driverSize, frequencyResponse, impedance, sensitivity,
  │                 noiseCancellation, codec (LDAC, aptX), cableLength
  │     Smartwatch: displaySize, displayType, os, sensors, gps,
  │                 waterRating, strapWidth
  │     Earbuds:    driverSize, ancLevel, transparency, stemDesign
  │     Speaker:    wattage, drivers, batteryLife, waterRating
  ├── connectivity (Bluetooth version, WiFi, USB-C, 3.5mm)
  ├── batteryLife (hours, chargingTime, wirelessCharging)
  ├── compatibility[] ─── (iOS, Android, Windows, macOS, PS5, Switch)
  ├── variants[] ─── color, edition, SKU, price, stock
  ├── images[] ─── hero, gallery, 360° frames, lifestyle shots
  ├── documents[] ─── user manual PDF, spec sheet
  └── releaseDate

Review
  ├── user, product, verifiedPurchase
  ├── ratings ─── overall, soundQuality, comfort, battery, buildQuality, value
  ├── content, photos[], helpfulCount
  └── deviceUsedWith (e.g., "iPhone 15 Pro", "Galaxy S24")

Order
  ├── user, status, paymentIntent
  ├── items[] ─── product, variant (color/edition), quantity, priceAtPurchase
  ├── shipping ─── address, carrier, trackingNumber
  └── warranty ─── plan, expiresAt

ComparisonSession
  ├── user (or anonymous session)
  └── products[] ─── up to 4 products for side-by-side comparison
```

### Search & Filtering (Meilisearch)
```
Facets:
  category      → Headphones, Smartwatches, Earbuds, Speakers
  brand         → Sony, Apple, Samsung, Bose, Sennheiser, JBL
  priceRange    → Under $50, $50-$100, $100-$200, $200+
  connectivity  → Bluetooth 5.3, WiFi, Wired, USB-C
  features      → ANC, Wireless Charging, Water Resistant, Hi-Res Audio
  compatibility → iOS, Android, Windows, macOS
  batteryLife   → 4h+, 8h+, 20h+, 40h+
  rating        → 4+ stars

Sort: relevance | price-asc | price-desc | newest | top-rated | best-selling
```

### Payment Flow
```
Browse → Compare → Add to Cart
  → Checkout (Stripe: card / Apple Pay / Google Pay / Klarna for installments)
  → Stripe Webhook → Create Order → Send Confirmation Email
  → Ship → Tracking Email → Deliver → Request Review
```

## Getting Started (Recommended Order)

1. Initialize Turborepo monorepo with shared packages
2. Set up PostgreSQL + Prisma schema (products, variants, specs, users, orders)
3. Seed database with sample tech accessories (headphones, watches, earbuds)
4. Build product catalog with spec-based filtering (Meilisearch)
5. Implement product detail page (specs table, 360° viewer, variant picker)
6. Build comparison tool (side-by-side specs)
7. Build cart + checkout with Stripe (Apple Pay / Google Pay / Klarna)
8. Add auth, order management, and transactional emails
9. Build admin dashboard (inventory, orders, product management)
10. Deploy and set up CI/CD
