import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@sonica/database";
import { meili, PRODUCTS_INDEX, configureProductsIndex } from "../lib/meilisearch";
import { requireAdmin } from "../middleware/auth";

export default async function searchRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── GET /api/search — Full-text search via Meilisearch ─────────────────
  fastify.get("/api/search", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      q?: string;
      category?: string;
      brand?: string;
      priceMin?: string;
      priceMax?: string;
      compatibility?: string;
      sort?: string;
      page?: string;
      limit?: string;
    };

    const searchQuery = query.q || "";
    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || "20", 10)));
    const offset = (page - 1) * limit;

    // Build filter array for Meilisearch
    const filters: string[] = ["active = true"];

    if (query.category) {
      const categories = query.category.split(",").map((c) => `category = "${c.trim()}"`);
      filters.push(`(${categories.join(" OR ")})`);
    }

    if (query.brand) {
      const brands = query.brand.split(",").map((b) => `brand = "${b.trim()}"`);
      filters.push(`(${brands.join(" OR ")})`);
    }

    if (query.priceMin) {
      filters.push(`price >= ${parseInt(query.priceMin, 10)}`);
    }

    if (query.priceMax) {
      filters.push(`price <= ${parseInt(query.priceMax, 10)}`);
    }

    if (query.compatibility) {
      const compatibilities = query.compatibility
        .split(",")
        .map((c) => `compatibility = "${c.trim()}"`);
      filters.push(`(${compatibilities.join(" OR ")})`);
    }

    // Build sort options for Meilisearch
    const sort: string[] = [];
    switch (query.sort) {
      case "price-asc":
        sort.push("price:asc");
        break;
      case "price-desc":
        sort.push("price:desc");
        break;
      case "newest":
        sort.push("releaseDate:desc");
        break;
      case "top-rated":
        sort.push("averageRating:desc");
        break;
      case "best-selling":
        sort.push("reviewCount:desc");
        break;
    }

    try {
      const index = meili.index(PRODUCTS_INDEX);
      const results = await index.search(searchQuery, {
        filter: filters.join(" AND "),
        sort: sort.length > 0 ? sort : undefined,
        offset,
        limit,
        facets: ["category", "brand", "compatibility"],
      });

      return reply.send({
        data: results.hits,
        facets: results.facetDistribution,
        pagination: {
          page,
          limit,
          total: results.estimatedTotalHits || 0,
          totalPages: Math.ceil((results.estimatedTotalHits || 0) / limit),
        },
        processingTimeMs: results.processingTimeMs,
      });
    } catch (error) {
      fastify.log.error(error, "Meilisearch search failed");
      return reply.code(503).send({
        error: "Search Unavailable",
        message: "Search service is temporarily unavailable",
      });
    }
  });

  // ─── POST /api/search/index (admin) — Re-index products to Meilisearch ─
  fastify.post(
    "/api/search/index",
    { preHandler: [requireAdmin] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Configure the index settings
        await configureProductsIndex();

        // Fetch all active products with their variants
        const products = await prisma.product.findMany({
          where: { active: true },
          include: {
            variants: true,
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
          },
        });

        // Transform products for Meilisearch indexing
        const documents = products.map((product) => {
          const minPrice = product.variants.length > 0
            ? Math.min(...product.variants.map((v) => v.price))
            : 0;
          const maxPrice = product.variants.length > 0
            ? Math.max(...product.variants.map((v) => v.price))
            : 0;

          return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            brand: product.brand,
            tagline: product.tagline,
            description: product.description,
            category: product.category.toLowerCase(),
            specs: product.specs,
            connectivity: product.connectivity,
            batteryLife: product.batteryLife,
            compatibility: product.compatibility,
            releaseDate: product.releaseDate.toISOString(),
            featured: product.featured,
            active: product.active,
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
            price: minPrice,
            priceMax: maxPrice,
            image: product.images[0]?.url || null,
            variantCount: product.variants.length,
            inStock: product.variants.some((v) => v.stock > 0),
          };
        });

        const index = meili.index(PRODUCTS_INDEX);
        const task = await index.addDocuments(documents, { primaryKey: "id" });

        return reply.send({
          data: {
            taskUid: task.taskUid,
            indexedCount: documents.length,
            status: "indexing",
          },
        });
      } catch (error) {
        fastify.log.error(error, "Meilisearch indexing failed");
        return reply.code(503).send({
          error: "Indexing Failed",
          message: "Search indexing service is temporarily unavailable",
        });
      }
    },
  );
}
