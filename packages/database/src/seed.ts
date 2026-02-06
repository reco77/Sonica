import { PrismaClient, Role, ProductCategory, ImageType, DocumentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Clean existing data ───────────────────────────────────────────────

  await prisma.priceHistory.deleteMany();
  await prisma.comparisonSession.deleteMany();
  await prisma.review.deleteMany();
  await prisma.warranty.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productDocument.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ─────────────────────────────────────────────────────────────

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@sonica.com",
      name: "Sonica Admin",
      passwordHash: "$2b$10$placeholder_hash_for_admin_password",
      role: Role.ADMIN,
      avatarUrl: "/images/avatars/admin.jpg",
      addresses: {
        create: {
          label: "work",
          street: "100 Sonica Blvd",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "US",
          isDefault: true,
          phone: "+1-415-555-0100",
        },
      },
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "alex.johnson@example.com",
      name: "Alex Johnson",
      passwordHash: "$2b$10$placeholder_hash_for_customer_password",
      role: Role.USER,
      avatarUrl: "/images/avatars/alex.jpg",
      addresses: {
        create: [
          {
            label: "home",
            street: "742 Evergreen Terrace",
            city: "Portland",
            state: "OR",
            postalCode: "97201",
            country: "US",
            isDefault: true,
            phone: "+1-503-555-0199",
          },
          {
            label: "work",
            street: "200 Tech Park Drive, Suite 300",
            city: "Portland",
            state: "OR",
            postalCode: "97204",
            country: "US",
            isDefault: false,
          },
        ],
      },
    },
  });

  console.log("  Created users:", adminUser.email, customerUser.email);

  // ─── Products ──────────────────────────────────────────────────────────

  // 1. Sony WH-1000XM5
  const sonyWH1000XM5 = await prisma.product.create({
    data: {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      brand: "Sony",
      tagline: "Industry-leading noise cancellation meets premium comfort",
      description:
        "The Sony WH-1000XM5 wireless noise-cancelling headphones represent the pinnacle of audio engineering. Featuring two processors controlling eight microphones for unprecedented noise cancellation, a newly designed 30mm driver unit for crystal-clear audio, and an ultra-comfortable lightweight design with soft-fit leather. With 30 hours of battery life and multipoint connectivity, these headphones seamlessly integrate into your daily life whether you're commuting, working, or relaxing.",
      category: ProductCategory.HEADPHONES,
      specs: {
        driver: "30mm",
        frequencyResponse: "4Hz-40,000Hz",
        impedance: "48 ohms (1kHz)",
        sensitivity: "102 dB/mW",
        weight: "250g",
        noiseCancellation: "Adaptive ANC with Auto NC Optimizer",
        microphones: "8 microphones with dual-processor system",
        codec: ["SBC", "AAC", "LDAC"],
      },
      connectivity: {
        bluetooth: "5.2",
        profiles: ["A2DP", "AVRCP", "HFP", "HSP"],
        nfc: true,
        wired: "3.5mm audio cable included",
        multipoint: true,
      },
      batteryLife: {
        playtime: "30 hours",
        chargingTime: "3.5 hours",
        quickCharge: "3 minutes for 3 hours playback",
        chargingPort: "USB-C",
      },
      compatibility: ["iOS", "Android", "Windows", "macOS", "PlayStation 5"],
      releaseDate: new Date("2022-05-20"),
      featured: true,
      active: true,
      averageRating: 4.7,
      reviewCount: 2,
      variants: {
        create: [
          {
            color: "Black",
            colorHex: "#1A1A1A",
            sku: "SONY-WH1000XM5-BLK",
            price: 39999,
            compareAtPrice: 44999,
            stock: 45,
          },
          {
            color: "Platinum Silver",
            colorHex: "#C0C0C0",
            sku: "SONY-WH1000XM5-SLV",
            price: 39999,
            compareAtPrice: 44999,
            stock: 30,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/sony-wh1000xm5-black-hero.jpg",
            alt: "Sony WH-1000XM5 in Black — front view",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/sony-wh1000xm5-silver-hero.jpg",
            alt: "Sony WH-1000XM5 in Platinum Silver — front view",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/sony-wh1000xm5-lifestyle-desk.jpg",
            alt: "Sony WH-1000XM5 on a desk in a home office",
            sortOrder: 2,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/sony-wh1000xm5-gallery-folded.jpg",
            alt: "Sony WH-1000XM5 folded in carrying case",
            sortOrder: 3,
            type: ImageType.GALLERY,
          },
          {
            url: "/images/products/sony-wh1000xm5-gallery-controls.jpg",
            alt: "Close-up of touch controls on the ear cup",
            sortOrder: 4,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/sony-wh1000xm5-manual.pdf",
            name: "User Manual",
            type: DocumentType.MANUAL,
          },
          {
            url: "/docs/sony-wh1000xm5-specs.pdf",
            name: "Technical Specifications",
            type: DocumentType.SPEC_SHEET,
          },
        ],
      },
    },
  });

  // 2. Apple AirPods Pro 2
  const airpodsPro2 = await prisma.product.create({
    data: {
      name: "Apple AirPods Pro 2",
      slug: "apple-airpods-pro-2",
      brand: "Apple",
      tagline: "Adaptive Audio. Now playing.",
      description:
        "AirPods Pro 2 deliver up to 2x more Active Noise Cancellation than the previous generation, plus Adaptive Audio that dynamically tailors noise control to your environment. The custom-built H2 chip powers advanced computational audio, while Personalized Spatial Audio with dynamic head tracking places sound all around you. A new low distortion driver and custom amplifier produce vivid, detailed sound. With six hours of listening time and a MagSafe charging case providing an additional 30 hours, AirPods Pro 2 are built for all-day use.",
      category: ProductCategory.EARBUDS,
      specs: {
        driver: "Custom Apple driver with amplifier",
        chip: "Apple H2",
        noiseCancellation: "Active Noise Cancellation with Adaptive Transparency",
        spatialAudio: "Personalized Spatial Audio with dynamic head tracking",
        waterResistance: "IPX4 (earbuds and case)",
        weight: "5.3g per earbud",
        earTips: ["XS", "S", "M", "L"],
      },
      connectivity: {
        bluetooth: "5.3",
        chip: "Apple H2",
        multipoint: false,
        appleEcosystem: true,
      },
      batteryLife: {
        playtime: "6 hours (ANC on)",
        caseTotal: "30 hours total",
        chargingTime: "1 hour (earbuds), varies (case)",
        quickCharge: "5 minutes for 1 hour playback",
        chargingPort: "USB-C / MagSafe / Qi",
      },
      compatibility: ["iOS", "iPadOS", "macOS", "watchOS", "tvOS", "Android (limited)"],
      releaseDate: new Date("2023-09-22"),
      featured: true,
      active: true,
      averageRating: 4.8,
      reviewCount: 1,
      variants: {
        create: [
          {
            color: "White",
            colorHex: "#F5F5F7",
            sku: "APPLE-APP2-WHT",
            price: 24999,
            stock: 120,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/airpods-pro-2-hero.jpg",
            alt: "Apple AirPods Pro 2 with MagSafe charging case",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/airpods-pro-2-in-ear.jpg",
            alt: "AirPods Pro 2 worn in ear",
            sortOrder: 1,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/airpods-pro-2-case-open.jpg",
            alt: "AirPods Pro 2 case open showing earbuds",
            sortOrder: 2,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/airpods-pro-2-manual.pdf",
            name: "User Guide",
            type: DocumentType.MANUAL,
          },
        ],
      },
    },
  });

  // 3. Apple Watch Ultra 2
  const appleWatchUltra2 = await prisma.product.create({
    data: {
      name: "Apple Watch Ultra 2",
      slug: "apple-watch-ultra-2",
      brand: "Apple",
      tagline: "Next-level adventure.",
      description:
        "Apple Watch Ultra 2 is the most rugged and capable Apple Watch ever. Built with a 49mm titanium case and a flat sapphire front crystal, it is designed to endure the most extreme environments. The brightest Apple Watch display at 3000 nits ensures readability in direct sunlight. Powered by the S9 SiP with a new 4-core Neural Engine, it delivers double-tap gesture, precision GPS with dual-frequency L1 and L5, and up to 36 hours of battery life — 72 hours in Low Power Mode. The ultimate tool for exploration, sport, and everyday life.",
      category: ProductCategory.SMARTWATCH,
      specs: {
        display: "49mm Always-On Retina LTPO2 OLED",
        resolution: "502 x 410 pixels",
        brightness: "3000 nits max",
        chip: "Apple S9 SiP",
        storage: "64GB",
        caseMaterial: "Titanium",
        waterResistance: "100m / WR100 / EN13319",
        sensors: [
          "Heart rate",
          "Blood oxygen",
          "Temperature",
          "Accelerometer",
          "Gyroscope",
          "Compass",
          "Barometric altimeter",
          "Depth gauge",
        ],
        operatingSystem: "watchOS 10",
      },
      connectivity: {
        bluetooth: "5.3",
        wifi: "802.11n (2.4GHz and 5GHz)",
        cellular: "LTE and UMTS",
        nfc: true,
        gps: "L1 and L5 dual-frequency",
        ultraWideband: "Second-generation Ultra Wideband chip",
      },
      batteryLife: {
        normal: "36 hours",
        lowPowerMode: "72 hours",
        chargingTime: "Approximately 1.5 hours to 100%",
        chargingPort: "Magnetic fast-charging USB-C cable",
      },
      compatibility: ["iPhone 11 or later with iOS 17"],
      releaseDate: new Date("2023-09-22"),
      featured: true,
      active: true,
      averageRating: 4.6,
      reviewCount: 0,
      variants: {
        create: [
          {
            color: "Natural Titanium / Orange Alpine Loop",
            colorHex: "#E8DCC8",
            edition: "Alpine Loop",
            sku: "APPLE-AWU2-ALP-ORG",
            price: 79999,
            stock: 20,
          },
          {
            color: "Natural Titanium / Blue Ocean Band",
            colorHex: "#1B3A5C",
            edition: "Ocean Band",
            sku: "APPLE-AWU2-OCN-BLU",
            price: 79999,
            stock: 15,
          },
          {
            color: "Natural Titanium / Olive Trail Loop",
            colorHex: "#6B7B3A",
            edition: "Trail Loop",
            sku: "APPLE-AWU2-TRL-OLV",
            price: 79999,
            stock: 18,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/apple-watch-ultra-2-hero.jpg",
            alt: "Apple Watch Ultra 2 with Orange Alpine Loop",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/apple-watch-ultra-2-ocean.jpg",
            alt: "Apple Watch Ultra 2 with Blue Ocean Band",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/apple-watch-ultra-2-trail.jpg",
            alt: "Apple Watch Ultra 2 with Olive Trail Loop",
            sortOrder: 2,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/apple-watch-ultra-2-lifestyle-hike.jpg",
            alt: "Apple Watch Ultra 2 worn during mountain hiking",
            sortOrder: 3,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/apple-watch-ultra-2-gallery-side.jpg",
            alt: "Side view showing Action Button and Digital Crown",
            sortOrder: 4,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/apple-watch-ultra-2-manual.pdf",
            name: "User Guide",
            type: DocumentType.MANUAL,
          },
          {
            url: "/docs/apple-watch-ultra-2-warranty.pdf",
            name: "Warranty Information",
            type: DocumentType.WARRANTY,
          },
        ],
      },
    },
  });

  // 4. Samsung Galaxy Watch 6
  const galaxyWatch6 = await prisma.product.create({
    data: {
      name: "Samsung Galaxy Watch 6 Classic",
      slug: "samsung-galaxy-watch-6-classic",
      brand: "Samsung",
      tagline: "Classic design. Cutting-edge features.",
      description:
        "The Samsung Galaxy Watch 6 Classic brings back the beloved rotating bezel with a sleek, modern design. Featuring a vibrant Super AMOLED display, advanced health monitoring with BioActive Sensor, and comprehensive sleep tracking with Sleep Coaching. Powered by Wear OS with One UI Watch 5, it offers seamless integration with your Galaxy smartphone and access to a vast app ecosystem. The sapphire crystal glass and IP68 + 5ATM + MIL-STD-810H ratings ensure durability for everyday wear.",
      category: ProductCategory.SMARTWATCH,
      specs: {
        display: "1.47-inch Super AMOLED (47mm model)",
        resolution: "480 x 480 pixels",
        brightness: "2000 nits",
        processor: "Exynos W930 Dual-Core 1.4GHz",
        storage: "16GB",
        ram: "2GB",
        caseMaterial: "Stainless Steel with rotating bezel",
        waterResistance: "5ATM + IP68",
        sensors: [
          "Samsung BioActive Sensor",
          "Accelerometer",
          "Barometer",
          "Gyroscope",
          "Geomagnetic",
          "Light sensor",
        ],
        operatingSystem: "Wear OS 4 / One UI Watch 5",
      },
      connectivity: {
        bluetooth: "5.3",
        wifi: "802.11 a/b/g/n (2.4 & 5GHz)",
        nfc: true,
        gps: "GPS, GLONASS, Beidou, Galileo",
      },
      batteryLife: {
        capacity: "425mAh (47mm)",
        normal: "Up to 40 hours (typical)",
        chargingTime: "Approximately 2 hours to full",
        chargingPort: "WPC wireless charging",
      },
      compatibility: ["Android 11+", "Samsung Galaxy smartphones (full features)"],
      releaseDate: new Date("2023-08-11"),
      featured: false,
      active: true,
      averageRating: 4.4,
      reviewCount: 0,
      variants: {
        create: [
          {
            color: "Black",
            colorHex: "#1A1A1A",
            edition: "47mm",
            sku: "SAMSUNG-GW6C-47-BLK",
            price: 42999,
            compareAtPrice: 44999,
            stock: 35,
          },
          {
            color: "Silver",
            colorHex: "#C0C0C0",
            edition: "47mm",
            sku: "SAMSUNG-GW6C-47-SLV",
            price: 42999,
            compareAtPrice: 44999,
            stock: 28,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/galaxy-watch-6-classic-black-hero.jpg",
            alt: "Samsung Galaxy Watch 6 Classic in Black",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/galaxy-watch-6-classic-silver-hero.jpg",
            alt: "Samsung Galaxy Watch 6 Classic in Silver",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/galaxy-watch-6-classic-lifestyle-wrist.jpg",
            alt: "Galaxy Watch 6 Classic worn on wrist during workout",
            sortOrder: 2,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/galaxy-watch-6-classic-gallery-bezel.jpg",
            alt: "Close-up of the rotating bezel",
            sortOrder: 3,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/galaxy-watch-6-classic-manual.pdf",
            name: "User Manual",
            type: DocumentType.MANUAL,
          },
          {
            url: "/docs/galaxy-watch-6-classic-specs.pdf",
            name: "Specification Sheet",
            type: DocumentType.SPEC_SHEET,
          },
        ],
      },
    },
  });

  // 5. Bose QuietComfort Ultra Headphones
  const boseQCUltra = await prisma.product.create({
    data: {
      name: "Bose QuietComfort Ultra Headphones",
      slug: "bose-quietcomfort-ultra",
      brand: "Bose",
      tagline: "Our best noise cancelling headphones ever.",
      description:
        "Bose QuietComfort Ultra Headphones deliver the ultimate in noise cancellation, spatial audio, and comfort. Featuring breakthrough Bose Immersive Audio for a truly immersive spatial experience, CustomTune technology that personalizes sound and noise cancellation to your ears, and the world-class quiet you expect from Bose. With premium materials including protein leather cushions and a stainless steel headband, they are designed for hours of comfortable listening. Three modes — Quiet, Aware, and Immersion — let you control your audio experience.",
      category: ProductCategory.HEADPHONES,
      specs: {
        driver: "35mm Bose proprietary",
        frequencyResponse: "20Hz-20,000Hz",
        weight: "250g",
        noiseCancellation: "Bose world-class ANC with CustomTune",
        spatialAudio: "Bose Immersive Audio",
        microphones: "Array of microphones for calls and ANC",
        codec: ["SBC", "AAC", "aptX Adaptive"],
        modes: ["Quiet Mode", "Aware Mode", "Immersion Mode"],
      },
      connectivity: {
        bluetooth: "5.3",
        profiles: ["A2DP", "AVRCP", "HFP"],
        multipoint: true,
        wired: "2.5mm to 3.5mm cable included",
      },
      batteryLife: {
        playtime: "24 hours",
        immersiveAudio: "18 hours with Immersive Audio",
        chargingTime: "2.5 hours",
        quickCharge: "15 minutes for 2.5 hours",
        chargingPort: "USB-C",
      },
      compatibility: ["iOS", "Android", "Windows", "macOS"],
      releaseDate: new Date("2023-10-03"),
      featured: true,
      active: true,
      averageRating: 4.5,
      reviewCount: 1,
      variants: {
        create: [
          {
            color: "Black",
            colorHex: "#1A1A1A",
            sku: "BOSE-QCUH-BLK",
            price: 42999,
            stock: 40,
          },
          {
            color: "White Smoke",
            colorHex: "#E8E4DF",
            sku: "BOSE-QCUH-WHT",
            price: 42999,
            stock: 25,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/bose-qc-ultra-black-hero.jpg",
            alt: "Bose QuietComfort Ultra Headphones in Black",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/bose-qc-ultra-white-hero.jpg",
            alt: "Bose QuietComfort Ultra Headphones in White Smoke",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/bose-qc-ultra-lifestyle-commute.jpg",
            alt: "Bose QC Ultra worn during commute",
            sortOrder: 2,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/bose-qc-ultra-gallery-earcup.jpg",
            alt: "Close-up of ear cushion and materials",
            sortOrder: 3,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/bose-qc-ultra-manual.pdf",
            name: "Owner's Guide",
            type: DocumentType.MANUAL,
          },
          {
            url: "/docs/bose-qc-ultra-warranty.pdf",
            name: "Warranty Card",
            type: DocumentType.WARRANTY,
          },
        ],
      },
    },
  });

  // 6. JBL Charge 5
  const jblCharge5 = await prisma.product.create({
    data: {
      name: "JBL Charge 5",
      slug: "jbl-charge-5",
      brand: "JBL",
      tagline: "Portable power, bold sound.",
      description:
        "The JBL Charge 5 delivers bold JBL Original Pro Sound with its optimized long-excursion driver, separate tweeter, and dual JBL bass radiators. Designed for outdoor adventures, it features IP67 waterproof and dustproof construction so you can take it anywhere. With 20 hours of playtime and a built-in power bank to charge your devices, the Charge 5 is your go-to speaker for extended outings. JBL PartyBoost lets you pair two JBL PartyBoost-compatible speakers for stereo sound or link multiple speakers to amplify the party.",
      category: ProductCategory.SPEAKER,
      specs: {
        driver: "52mm woofer + 20mm tweeter",
        frequencyResponse: "65Hz-20,000Hz",
        outputPower: "30W RMS (20W woofer + 10W tweeter)",
        signalToNoise: ">80dB",
        waterResistance: "IP67 waterproof and dustproof",
        weight: "960g",
        dimensions: "223 x 96.5 x 94 mm",
        powerBank: "7500mAh built-in",
      },
      connectivity: {
        bluetooth: "5.1",
        profiles: ["A2DP v1.3", "AVRCP v1.6"],
        partyBoost: true,
        wired: false,
      },
      batteryLife: {
        playtime: "20 hours",
        chargingTime: "4 hours",
        chargingPort: "USB-C",
        powerBank: "Yes, USB-A output for device charging",
      },
      compatibility: ["iOS", "Android", "Windows", "macOS", "Any Bluetooth device"],
      releaseDate: new Date("2021-03-15"),
      featured: false,
      active: true,
      averageRating: 4.6,
      reviewCount: 0,
      variants: {
        create: [
          {
            color: "Black",
            colorHex: "#1A1A1A",
            sku: "JBL-CHARGE5-BLK",
            price: 17999,
            compareAtPrice: 19999,
            stock: 60,
          },
          {
            color: "Blue",
            colorHex: "#3366CC",
            sku: "JBL-CHARGE5-BLU",
            price: 17999,
            compareAtPrice: 19999,
            stock: 40,
          },
          {
            color: "Red",
            colorHex: "#CC3333",
            sku: "JBL-CHARGE5-RED",
            price: 17999,
            compareAtPrice: 19999,
            stock: 35,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/jbl-charge-5-black-hero.jpg",
            alt: "JBL Charge 5 in Black",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/jbl-charge-5-blue-hero.jpg",
            alt: "JBL Charge 5 in Blue",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/jbl-charge-5-red-hero.jpg",
            alt: "JBL Charge 5 in Red",
            sortOrder: 2,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/jbl-charge-5-lifestyle-pool.jpg",
            alt: "JBL Charge 5 by the pool",
            sortOrder: 3,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/jbl-charge-5-gallery-ports.jpg",
            alt: "Close-up of USB-C and USB-A ports",
            sortOrder: 4,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/jbl-charge-5-manual.pdf",
            name: "Quick Start Guide",
            type: DocumentType.MANUAL,
          },
          {
            url: "/docs/jbl-charge-5-specs.pdf",
            name: "Specifications",
            type: DocumentType.SPEC_SHEET,
          },
        ],
      },
    },
  });

  // 7. Sennheiser Momentum 4
  const sennheiserMomentum4 = await prisma.product.create({
    data: {
      name: "Sennheiser Momentum 4 Wireless",
      slug: "sennheiser-momentum-4-wireless",
      brand: "Sennheiser",
      tagline: "Sound that moves you. Style that defines you.",
      description:
        "Sennheiser MOMENTUM 4 Wireless headphones combine audiophile-grade sound with modern design and exceptional comfort. Featuring a 42mm transducer system, Adaptive Noise Cancellation, and Transparent Hearing mode, they deliver an immersive audio experience with remarkable detail and clarity. The sleek, minimalist design with premium materials offers all-day comfort, while an incredible 60 hours of battery life means you can go days without charging. Smart features like auto pause/play, customizable EQ via the Sennheiser Smart Control app, and Sidetone for calls round out this premium package.",
      category: ProductCategory.HEADPHONES,
      specs: {
        driver: "42mm dynamic transducer",
        frequencyResponse: "6Hz-22,000Hz",
        impedance: "470 ohms passive",
        sensitivity: "106 dB (1kHz / 1 Vrms)",
        weight: "293g",
        noiseCancellation: "Adaptive ANC with Transparent Hearing",
        microphones: "4 microphones for ANC, 2 for calls",
        codec: ["SBC", "AAC", "aptX", "aptX Adaptive"],
      },
      connectivity: {
        bluetooth: "5.2",
        profiles: ["A2DP", "AVRCP", "HFP"],
        multipoint: true,
        wired: "3.5mm and USB-C (audio)",
      },
      batteryLife: {
        playtime: "60 hours (ANC on)",
        chargingTime: "2 hours",
        quickCharge: "7 minutes for 4 hours",
        chargingPort: "USB-C",
      },
      compatibility: ["iOS", "Android", "Windows", "macOS"],
      releaseDate: new Date("2022-08-09"),
      featured: false,
      active: true,
      averageRating: 4.5,
      reviewCount: 0,
      variants: {
        create: [
          {
            color: "Black",
            colorHex: "#1A1A1A",
            sku: "SENN-M4W-BLK",
            price: 34999,
            compareAtPrice: 37999,
            stock: 25,
          },
          {
            color: "White",
            colorHex: "#F0EDE8",
            sku: "SENN-M4W-WHT",
            price: 34999,
            compareAtPrice: 37999,
            stock: 20,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/sennheiser-momentum-4-black-hero.jpg",
            alt: "Sennheiser Momentum 4 Wireless in Black",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/sennheiser-momentum-4-white-hero.jpg",
            alt: "Sennheiser Momentum 4 Wireless in White",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/sennheiser-momentum-4-lifestyle-cafe.jpg",
            alt: "Sennheiser Momentum 4 worn in a cafe",
            sortOrder: 2,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/sennheiser-momentum-4-gallery-detail.jpg",
            alt: "Detail of the headband and ear cushion materials",
            sortOrder: 3,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/sennheiser-momentum-4-manual.pdf",
            name: "Instruction Manual",
            type: DocumentType.MANUAL,
          },
        ],
      },
    },
  });

  // 8. Sony WF-1000XM5
  const sonyWF1000XM5 = await prisma.product.create({
    data: {
      name: "Sony WF-1000XM5",
      slug: "sony-wf-1000xm5",
      brand: "Sony",
      tagline: "Unmatched noise cancelling. Unbelievably small.",
      description:
        "Sony WF-1000XM5 are Sony's smallest and lightest truly wireless noise-cancelling earbuds yet. Powered by the Integrated Processor V2 and a new 8.4mm Dynamic Driver X, they deliver industry-leading noise cancellation in an incredibly compact form factor. DSEE Extreme upscales compressed audio in real time, while LDAC support ensures high-resolution audio transmission. Speak-to-Chat automatically pauses music when you start talking, and Adaptive Sound Control adjusts noise cancellation based on your activity. With IPX4 water resistance and foam ear tips included, they are designed for both audio excellence and daily resilience.",
      category: ProductCategory.EARBUDS,
      specs: {
        driver: "8.4mm Dynamic Driver X",
        processor: "Integrated Processor V2 + QN2e",
        frequencyResponse: "20Hz-40,000Hz (LDAC)",
        noiseCancellation: "Industry-leading ANC",
        waterResistance: "IPX4",
        weight: "5.9g per earbud",
        earTips: "Noise isolation foam tips (SS/S/M/L)",
        codec: ["SBC", "AAC", "LDAC", "LC3"],
      },
      connectivity: {
        bluetooth: "5.3",
        profiles: ["A2DP", "AVRCP", "HFP", "HSP", "TMAP", "BAP", "CSIP", "MCP", "VCP"],
        multipoint: true,
      },
      batteryLife: {
        playtime: "8 hours (ANC on), 12 hours (ANC off)",
        caseTotal: "24 hours total (ANC on)",
        chargingTime: "1.5 hours (earbuds), 2 hours (case)",
        quickCharge: "3 minutes for 60 minutes playback",
        chargingPort: "USB-C / Qi wireless",
      },
      compatibility: ["iOS", "Android", "Windows", "macOS"],
      releaseDate: new Date("2023-07-25"),
      featured: true,
      active: true,
      averageRating: 4.7,
      reviewCount: 0,
      variants: {
        create: [
          {
            color: "Black",
            colorHex: "#1A1A1A",
            sku: "SONY-WF1000XM5-BLK",
            price: 29999,
            stock: 50,
          },
          {
            color: "Platinum Silver",
            colorHex: "#D4CFC9",
            sku: "SONY-WF1000XM5-SLV",
            price: 29999,
            stock: 35,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/products/sony-wf1000xm5-black-hero.jpg",
            alt: "Sony WF-1000XM5 in Black with charging case",
            sortOrder: 0,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/sony-wf1000xm5-silver-hero.jpg",
            alt: "Sony WF-1000XM5 in Platinum Silver with charging case",
            sortOrder: 1,
            type: ImageType.HERO,
          },
          {
            url: "/images/products/sony-wf1000xm5-lifestyle-commute.jpg",
            alt: "Sony WF-1000XM5 worn during morning commute",
            sortOrder: 2,
            type: ImageType.LIFESTYLE,
          },
          {
            url: "/images/products/sony-wf1000xm5-gallery-case.jpg",
            alt: "Close-up of the compact charging case",
            sortOrder: 3,
            type: ImageType.GALLERY,
          },
          {
            url: "/images/products/sony-wf1000xm5-gallery-tips.jpg",
            alt: "Included foam ear tips in various sizes",
            sortOrder: 4,
            type: ImageType.GALLERY,
          },
        ],
      },
      documents: {
        create: [
          {
            url: "/docs/sony-wf1000xm5-manual.pdf",
            name: "Help Guide",
            type: DocumentType.MANUAL,
          },
          {
            url: "/docs/sony-wf1000xm5-specs.pdf",
            name: "Specifications",
            type: DocumentType.SPEC_SHEET,
          },
        ],
      },
    },
  });

  console.log("  Created 8 products");

  // ─── Reviews ───────────────────────────────────────────────────────────

  // Review 1: Customer reviews Sony WH-1000XM5
  await prisma.review.create({
    data: {
      userId: customerUser.id,
      productId: sonyWH1000XM5.id,
      overallRating: 5,
      soundQualityRating: 5,
      comfortRating: 5,
      batteryRating: 5,
      buildQualityRating: 4,
      valueRating: 4,
      title: "Best noise-cancelling headphones I've ever owned",
      content:
        "I've been using the Sony WH-1000XM5 for about three months now and they've completely changed my daily commute. The noise cancellation is phenomenal — even on a crowded subway, I can barely hear anything outside. The sound quality is rich and detailed, with deep bass that doesn't overpower the mids and highs. Comfort is exceptional; the lighter weight compared to the XM4 is noticeable during long listening sessions. My only minor gripe is the folding mechanism — they don't fold as compactly as the XM4. But overall, these are the best headphones I've ever owned.",
      pros: [
        "Industry-leading noise cancellation",
        "Exceptional sound quality with LDAC support",
        "Incredibly comfortable for all-day wear",
        "30-hour battery life is fantastic",
        "Multipoint connection works seamlessly",
      ],
      cons: [
        "Case is larger since headphones don't fold flat",
        "Touch controls can be finicky in cold weather",
        "Premium price point",
      ],
      deviceUsedWith: "iPhone 15 Pro, MacBook Pro M3",
      verifiedPurchase: true,
      helpfulCount: 24,
      photos: [
        "/images/reviews/sony-xm5-review-1-desk.jpg",
        "/images/reviews/sony-xm5-review-1-case.jpg",
      ],
    },
  });

  // Review 2: Admin reviews Sony WH-1000XM5
  await prisma.review.create({
    data: {
      userId: adminUser.id,
      productId: sonyWH1000XM5.id,
      overallRating: 4,
      soundQualityRating: 5,
      comfortRating: 4,
      batteryRating: 5,
      buildQualityRating: 4,
      valueRating: 4,
      title: "Superb audio, a worthy upgrade from XM4",
      content:
        "Having used the XM4 for two years, I was excited to try the XM5. The sound quality is noticeably improved — cleaner highs and more precise imaging. The ANC is incrementally better, particularly with irregular sounds like keyboard typing and conversation. The new design is sleek but I slightly prefer the XM4's folding design for travel. Call quality has improved significantly with the new microphone system. The auto-switching between devices via multipoint is seamless. Highly recommended for anyone looking for premium wireless headphones.",
      pros: [
        "Improved sound quality over XM4",
        "Better call quality",
        "Lightweight and comfortable",
        "Excellent app with customization",
      ],
      cons: [
        "Doesn't fold as compact as XM4",
        "Price is on the higher side",
      ],
      deviceUsedWith: "Samsung Galaxy S24 Ultra, Windows 11 PC",
      verifiedPurchase: true,
      helpfulCount: 18,
      photos: [],
    },
  });

  // Review 3: Customer reviews AirPods Pro 2
  await prisma.review.create({
    data: {
      userId: customerUser.id,
      productId: airpodsPro2.id,
      overallRating: 5,
      soundQualityRating: 5,
      comfortRating: 5,
      batteryRating: 4,
      buildQualityRating: 5,
      valueRating: 4,
      title: "The perfect earbuds for the Apple ecosystem",
      content:
        "If you're deep in the Apple ecosystem, these are simply the best earbuds you can buy. The Adaptive Audio feature is a game changer — it seamlessly transitions between noise cancellation and transparency based on what's happening around you. Spatial Audio with head tracking is incredible for movies and compatible music. The USB-C case with the speaker for Find My is a great quality-of-life improvement. Sound quality is excellent for earbuds this size, with a balanced profile that works well across genres. My only wish is slightly longer battery life, but the quick charge feature helps.",
      pros: [
        "Adaptive Audio is magical",
        "Spatial Audio with head tracking",
        "USB-C case with speaker for Find My",
        "Seamless Apple ecosystem integration",
        "Comfortable for hours of wear",
      ],
      cons: [
        "6 hours battery life could be longer",
        "Limited features on Android",
        "No lossless Bluetooth codec",
      ],
      deviceUsedWith: "iPhone 15, iPad Pro, MacBook Air M2",
      verifiedPurchase: true,
      helpfulCount: 31,
      photos: [
        "/images/reviews/airpods-pro-2-review-1-case.jpg",
      ],
    },
  });

  // Review 4: Admin reviews Bose QC Ultra
  await prisma.review.create({
    data: {
      userId: adminUser.id,
      productId: boseQCUltra.id,
      overallRating: 4,
      soundQualityRating: 5,
      comfortRating: 5,
      batteryRating: 3,
      buildQualityRating: 5,
      valueRating: 4,
      title: "Incredible spatial audio, but battery takes a hit",
      content:
        "The Bose QuietComfort Ultra headphones deliver an extraordinary listening experience. The Immersive Audio feature creates a genuinely spacious soundstage that is unlike anything I've heard from headphones before. Noise cancellation is on par with Sony's best — maybe even slightly better for low-frequency rumble. Build quality is excellent with premium materials throughout. The only downside is battery life — with Immersive Audio enabled, you get about 18 hours instead of the 24-hour rated life. It's still plenty for most use cases, but notable compared to competitors offering 30+ hours. Overall, these are outstanding headphones.",
      pros: [
        "Bose Immersive Audio is revolutionary",
        "World-class noise cancellation",
        "Supremely comfortable for extended wear",
        "Premium build quality and materials",
        "CustomTune personalizes to your ears",
      ],
      cons: [
        "Battery life drops significantly with Immersive Audio",
        "Higher price than the competition",
        "No aptX Lossless support",
      ],
      deviceUsedWith: "Google Pixel 8 Pro, Windows laptop",
      verifiedPurchase: true,
      helpfulCount: 12,
      photos: [],
    },
  });

  console.log("  Created 4 reviews");

  // ─── Price History ─────────────────────────────────────────────────────

  // Fetch variants for price history
  const sonyBlackVariant = await prisma.productVariant.findUnique({
    where: { sku: "SONY-WH1000XM5-BLK" },
  });
  const airpodsVariant = await prisma.productVariant.findUnique({
    where: { sku: "APPLE-APP2-WHT" },
  });

  if (sonyBlackVariant) {
    await prisma.priceHistory.createMany({
      data: [
        { variantId: sonyBlackVariant.id, price: 44999, recordedAt: new Date("2023-01-01") },
        { variantId: sonyBlackVariant.id, price: 42999, recordedAt: new Date("2023-06-15") },
        { variantId: sonyBlackVariant.id, price: 39999, recordedAt: new Date("2024-01-10") },
      ],
    });
  }

  if (airpodsVariant) {
    await prisma.priceHistory.createMany({
      data: [
        { variantId: airpodsVariant.id, price: 24999, recordedAt: new Date("2023-09-22") },
        { variantId: airpodsVariant.id, price: 19999, recordedAt: new Date("2023-11-24") },
        { variantId: airpodsVariant.id, price: 24999, recordedAt: new Date("2023-12-01") },
      ],
    });
  }

  console.log("  Created price history entries");

  // ─── Sample Order ──────────────────────────────────────────────────────

  if (sonyBlackVariant) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "SON-2024-00001",
        userId: customerUser.id,
        status: "DELIVERED",
        subtotal: 39999,
        tax: 3400,
        shippingCost: 0,
        total: 43399,
        shippingAddress: {
          name: "Alex Johnson",
          street: "742 Evergreen Terrace",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "US",
          phone: "+1-503-555-0199",
        },
        trackingNumber: "1Z999AA10123456784",
        carrier: "UPS",
        items: {
          create: {
            variantId: sonyBlackVariant.id,
            productName: "Sony WH-1000XM5",
            variantColor: "Black",
            quantity: 1,
            priceAtPurchase: 39999,
          },
        },
        warranty: {
          create: {
            userId: customerUser.id,
            plan: "STANDARD",
            expiresAt: new Date("2025-06-15"),
            status: "ACTIVE",
          },
        },
      },
    });

    console.log("  Created sample order:", order.orderNumber);
  }

  // ─── Comparison Session ────────────────────────────────────────────────

  await prisma.comparisonSession.create({
    data: {
      sessionToken: "cmp_sample_session_001",
      userId: customerUser.id,
      productIds: [sonyWH1000XM5.id, boseQCUltra.id, sennheiserMomentum4.id],
    },
  });

  console.log("  Created sample comparison session");

  console.log("\nSeeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
