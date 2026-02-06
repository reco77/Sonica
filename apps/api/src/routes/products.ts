import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma, Prisma, type ProductCategory } from "@sonica/database";
import { createProductSchema } from "@sonica/shared";
import { requireAdmin } from "../middleware/auth";

export default async function productRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── GET /api/products — List products with filtering ────────────────────
  fastify.get("/api/products", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      category?: string;
      brand?: string;
      priceMin?: string;
      priceMax?: string;
      connectivity?: string;
      compatibility?: string;
      features?: string;
      sort?: string;
      page?: string;
      limit?: string;
    };

    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || "20", 10)));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = { active: true };

    if (query.category) {
      const categories = query.category.split(",").map((c) => c.trim().toUpperCase());
      where.category = { in: categories as Prisma.EnumProductCategoryFilter["in"] };
    }

    if (query.brand) {
      const brands = query.brand.split(",").map((b) => b.trim());
      where.brand = { in: brands };
    }

    if (query.priceMin || query.priceMax) {
      where.variants = {
        some: {
          price: {
            ...(query.priceMin ? { gte: parseInt(query.priceMin, 10) } : {}),
            ...(query.priceMax ? { lte: parseInt(query.priceMax, 10) } : {}),
          },
        },
      };
    }

    if (query.connectivity) {
      const connectivityFilters = query.connectivity.split(",").map((c) => c.trim());
      const connectivityConditions: Prisma.ProductWhereInput[] = [];

      for (const filter of connectivityFilters) {
        switch (filter) {
          case "bluetooth":
            connectivityConditions.push({
              connectivity: { path: ["bluetoothVersion"], not: Prisma.DbNull },
            });
            break;
          case "wifi":
            connectivityConditions.push({
              connectivity: { path: ["wifi"], equals: true },
            });
            break;
          case "usb-c":
            connectivityConditions.push({
              connectivity: { path: ["usbC"], equals: true },
            });
            break;
          case "aux":
            connectivityConditions.push({
              connectivity: { path: ["auxJack"], equals: true },
            });
            break;
        }
      }

      if (connectivityConditions.length > 0) {
        where.AND = [
          ...(Array.isArray(where.AND) ? where.AND : []),
          ...connectivityConditions,
        ];
      }
    }

    if (query.compatibility) {
      const compatibilities = query.compatibility.split(",").map((c) => c.trim());
      where.compatibility = { hasSome: compatibilities };
    }

    if (query.features) {
      const features = query.features.split(",").map((f) => f.trim());
      const featureConditions: Prisma.ProductWhereInput[] = [];

      for (const feature of features) {
        switch (feature) {
          case "noise-cancellation":
            featureConditions.push({
              specs: { path: ["noiseCancellation"], equals: true },
            });
            break;
          case "wireless-charging":
            featureConditions.push({
              batteryLife: { path: ["wirelessCharging"], equals: true },
            });
            break;
          case "water-resistant":
            featureConditions.push({
              specs: { path: ["waterRating"], not: Prisma.DbNull },
            });
            break;
        }
      }

      if (featureConditions.length > 0) {
        where.AND = [
          ...(Array.isArray(where.AND) ? where.AND : []),
          ...featureConditions,
        ];
      }
    }

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    const isPriceSort = query.sort === "price-asc" || query.sort === "price-desc";

    if (!isPriceSort) {
      switch (query.sort) {
        case "newest":
          orderBy = { releaseDate: "desc" };
          break;
        case "top-rated":
          orderBy = { averageRating: "desc" };
          break;
        case "best-selling":
          orderBy = { reviewCount: "desc" };
          break;
        case "name-asc":
          orderBy = { name: "asc" };
          break;
        case "name-desc":
          orderBy = { name: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
    }

    let products;
    let total: number;

    if (isPriceSort) {
      // Price sorting requires ordering by minimum variant price, which Prisma
      // does not support via orderBy on relation aggregates. We fetch matching
      // product IDs with their variant prices, sort in application code, then
      // load full product details for the paginated slice.
      total = await prisma.product.count({ where });

      const lightweight = await prisma.product.findMany({
        where,
        select: { id: true, variants: { select: { price: true } } },
      });

      const sorted = lightweight
        .map((p) => ({
          id: p.id,
          minPrice: p.variants.length > 0
            ? Math.min(...p.variants.map((v) => v.price))
            : 0,
        }))
        .sort((a, b) =>
          query.sort === "price-asc"
            ? a.minPrice - b.minPrice
            : b.minPrice - a.minPrice,
        );

      const pageIds = sorted.slice(skip, skip + limit).map((p) => p.id);

      const fetched = await prisma.product.findMany({
        where: { id: { in: pageIds } },
        include: {
          variants: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      });

      // Preserve the sort order from the sorted IDs
      products = pageIds
        .map((id) => fetched.find((p) => p.id === id))
        .filter(Boolean);
    } else {
      [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            variants: true,
            images: { orderBy: { sortOrder: "asc" } },
          },
        }),
        prisma.product.count({ where }),
      ]);
    }

    return reply.send({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // ─── GET /api/products/featured — Get featured products ──────────────────
  fastify.get("/api/products/featured", async (_request: FastifyRequest, reply: FastifyReply) => {
    const products = await prisma.product.findMany({
      where: { featured: true, active: true },
      include: {
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { averageRating: "desc" },
      take: 12,
    });

    return reply.send({ data: products });
  });

  // ─── GET /api/products/:slug — Get single product by slug ────────────────
  fastify.get("/api/products/:slug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
        documents: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!product || !product.active) {
      return reply.code(404).send({ error: "Not Found", message: "Product not found" });
    }

    return reply.send({ data: product });
  });

  // ─── GET /api/products/:slug/reviews — Get reviews for a product ─────────
  fastify.get("/api/products/:slug/reviews", async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const query = request.query as { page?: string; limit?: string; sort?: string };

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return reply.code(404).send({ error: "Not Found", message: "Product not found" });
    }

    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: "desc" };
    switch (query.sort) {
      case "helpful":
        orderBy = { helpfulCount: "desc" };
        break;
      case "rating-desc":
        orderBy = { overallRating: "desc" };
        break;
      case "rating-asc":
        orderBy = { overallRating: "asc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id },
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.review.count({ where: { productId: product.id } }),
    ]);

    return reply.send({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // ─── POST /api/products (admin only) — Create product ────────────────────
  fastify.post(
    "/api/products",
    { preHandler: [requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = createProductSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const data = parsed.data;

      // Check for duplicate slug
      const existing = await prisma.product.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });

      if (existing) {
        return reply.code(409).send({
          error: "Conflict",
          message: "A product with this slug already exists",
        });
      }

      const product = await prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          brand: data.brand,
          tagline: data.tagline,
          description: data.description,
          category: data.category.toUpperCase() as ProductCategory,
          specs: data.specs as Prisma.InputJsonValue,
          connectivity: data.connectivity as Prisma.InputJsonValue,
          batteryLife: data.batteryLife ? (data.batteryLife as Prisma.InputJsonValue) : undefined,
          compatibility: data.compatibility,
          releaseDate: new Date(data.releaseDate),
          featured: data.featured,
          variants: {
            create: data.variants.map((v) => ({
              color: v.color,
              colorHex: v.colorHex,
              edition: v.edition,
              sku: v.sku,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              stock: v.stock,
            })),
          },
          images: {
            create: data.images.map((url, index) => ({
              url,
              sortOrder: index,
              type: index === 0 ? "HERO" : "GALLERY",
            })),
          },
        },
        include: {
          variants: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      });

      return reply.code(201).send({ data: product });
    },
  );

  // ─── PUT /api/products/:id (admin only) — Update product ─────────────────
  fastify.put(
    "/api/products/:id",
    { preHandler: [requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as Record<string, unknown>;

      const existing = await prisma.product.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: "Not Found", message: "Product not found" });
      }

      // Build partial update data
      const updateData: Prisma.ProductUpdateInput = {};

      if (body.name !== undefined) updateData.name = body.name as string;
      if (body.slug !== undefined) updateData.slug = body.slug as string;
      if (body.brand !== undefined) updateData.brand = body.brand as string;
      if (body.tagline !== undefined) updateData.tagline = body.tagline as string;
      if (body.description !== undefined) updateData.description = body.description as string;
      if (body.category !== undefined) {
        updateData.category = (body.category as string).toUpperCase() as ProductCategory;
      }
      if (body.specs !== undefined) updateData.specs = body.specs as Prisma.InputJsonValue;
      if (body.connectivity !== undefined) updateData.connectivity = body.connectivity as Prisma.InputJsonValue;
      if (body.batteryLife !== undefined) updateData.batteryLife = body.batteryLife as Prisma.InputJsonValue;
      if (body.compatibility !== undefined) updateData.compatibility = body.compatibility as string[];
      if (body.releaseDate !== undefined) updateData.releaseDate = new Date(body.releaseDate as string);
      if (body.featured !== undefined) updateData.featured = body.featured as boolean;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          variants: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      });

      return reply.send({ data: product });
    },
  );

  // ─── DELETE /api/products/:id (admin only) — Soft delete ─────────────────
  fastify.delete(
    "/api/products/:id",
    { preHandler: [requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const existing = await prisma.product.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: "Not Found", message: "Product not found" });
      }

      await prisma.product.update({
        where: { id },
        data: { active: false },
      });

      return reply.code(204).send();
    },
  );
}
