import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@sonica/database";
import { optionalAuth } from "../middleware/auth";
import { z } from "zod";
import crypto from "crypto";

const createComparisonSchema = z.object({
  productIds: z.array(z.string().min(1)).min(2).max(4),
});

export default async function compareRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/compare — Create comparison session ──────────────────────
  fastify.post(
    "/api/compare",
    { preHandler: [optionalAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = createComparisonSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const { productIds } = parsed.data;

      // Verify all products exist and are active
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          active: true,
        },
        select: { id: true },
      });

      if (products.length !== productIds.length) {
        return reply.code(400).send({
          error: "Invalid Products",
          message: "One or more product IDs are invalid or inactive",
        });
      }

      const sessionToken = crypto.randomBytes(16).toString("hex");

      const session = await prisma.comparisonSession.create({
        data: {
          sessionToken,
          userId: request.user?.id || null,
          productIds,
        },
      });

      return reply.code(201).send({
        data: {
          token: session.sessionToken,
          productIds: session.productIds,
        },
      });
    },
  );

  // ─── GET /api/compare/:token — Get comparison session with full details ─
  fastify.get("/api/compare/:token", async (request: FastifyRequest, reply: FastifyReply) => {
    const { token } = request.params as { token: string };

    const session = await prisma.comparisonSession.findUnique({
      where: { sessionToken: token },
    });

    if (!session) {
      return reply.code(404).send({
        error: "Not Found",
        message: "Comparison session not found",
      });
    }

    // Fetch full product details for comparison
    const products = await prisma.product.findMany({
      where: {
        id: { in: session.productIds },
        active: true,
      },
      include: {
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    // Maintain the original order of product IDs
    const orderedProducts = session.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

    return reply.send({
      data: {
        token: session.sessionToken,
        products: orderedProducts,
        createdAt: session.createdAt,
      },
    });
  });
}
