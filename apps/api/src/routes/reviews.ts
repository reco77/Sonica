import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@sonica/database";
import { createReviewSchema } from "@sonica/shared";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

const updateReviewSchema = z.object({
  ratings: z
    .object({
      overall: z.number().int().min(1).max(5),
      soundQuality: z.number().int().min(1).max(5).optional(),
      comfort: z.number().int().min(1).max(5).optional(),
      battery: z.number().int().min(1).max(5).optional(),
      buildQuality: z.number().int().min(1).max(5).optional(),
      value: z.number().int().min(1).max(5).optional(),
    })
    .optional(),
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(10).max(5000).optional(),
  pros: z.array(z.string().min(1)).optional(),
  cons: z.array(z.string().min(1)).optional(),
  deviceUsedWith: z.string().max(100).optional(),
});

async function recalculateProductRating(productId: string): Promise<void> {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { overallRating: true },
    _count: { id: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: result._avg.overallRating || 0,
      reviewCount: result._count.id,
    },
  });
}

export default async function reviewRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/products/:slug/reviews — Create review ───────────────────
  fastify.post(
    "/api/products/:slug/reviews",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { slug } = request.params as { slug: string };
      const userId = request.user!.id;

      const product = await prisma.product.findUnique({
        where: { slug },
        select: { id: true, active: true },
      });

      if (!product || !product.active) {
        return reply.code(404).send({ error: "Not Found", message: "Product not found" });
      }

      // Override productId from the URL parameter
      const body = { ...(request.body as object), productId: product.id };
      const parsed = createReviewSchema.safeParse(body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const data = parsed.data;

      // Check if user already reviewed this product
      const existingReview = await prisma.review.findUnique({
        where: { userId_productId: { userId, productId: product.id } },
      });

      if (existingReview) {
        return reply.code(409).send({
          error: "Conflict",
          message: "You have already reviewed this product",
        });
      }

      // Check if verified purchase
      const hasPurchased = await prisma.order.findFirst({
        where: {
          userId,
          status: { in: ["DELIVERED", "SHIPPED", "CONFIRMED"] },
          items: {
            some: {
              variant: { productId: product.id },
            },
          },
        },
        select: { id: true },
      });

      const review = await prisma.review.create({
        data: {
          userId,
          productId: product.id,
          overallRating: data.ratings.overall,
          soundQualityRating: data.ratings.soundQuality,
          comfortRating: data.ratings.comfort,
          batteryRating: data.ratings.battery,
          buildQualityRating: data.ratings.buildQuality,
          valueRating: data.ratings.value,
          title: data.title,
          content: data.body,
          pros: data.pros || [],
          cons: data.cons || [],
          deviceUsedWith: data.deviceUsedWith,
          verifiedPurchase: !!hasPurchased,
          photos: [],
        },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      // Recalculate product average rating
      await recalculateProductRating(product.id);

      return reply.code(201).send({ data: review });
    },
  );

  // ─── PUT /api/reviews/:id — Update own review ──────────────────────────
  fastify.put(
    "/api/reviews/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;

      const existing = await prisma.review.findUnique({
        where: { id },
        select: { id: true, userId: true, productId: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: "Not Found", message: "Review not found" });
      }

      if (existing.userId !== userId) {
        return reply.code(403).send({ error: "Forbidden", message: "You can only edit your own reviews" });
      }

      const parsed = updateReviewSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const data = parsed.data;

      const updateData: Record<string, unknown> = {};

      if (data.ratings) {
        if (data.ratings.overall !== undefined) updateData.overallRating = data.ratings.overall;
        if (data.ratings.soundQuality !== undefined) updateData.soundQualityRating = data.ratings.soundQuality;
        if (data.ratings.comfort !== undefined) updateData.comfortRating = data.ratings.comfort;
        if (data.ratings.battery !== undefined) updateData.batteryRating = data.ratings.battery;
        if (data.ratings.buildQuality !== undefined) updateData.buildQualityRating = data.ratings.buildQuality;
        if (data.ratings.value !== undefined) updateData.valueRating = data.ratings.value;
      }

      if (data.title !== undefined) updateData.title = data.title;
      if (data.body !== undefined) updateData.content = data.body;
      if (data.pros !== undefined) updateData.pros = data.pros;
      if (data.cons !== undefined) updateData.cons = data.cons;
      if (data.deviceUsedWith !== undefined) updateData.deviceUsedWith = data.deviceUsedWith;

      const review = await prisma.review.update({
        where: { id },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      // Recalculate product average rating if overall changed
      if (data.ratings?.overall !== undefined) {
        await recalculateProductRating(existing.productId);
      }

      return reply.send({ data: review });
    },
  );

  // ─── DELETE /api/reviews/:id — Delete own review ────────────────────────
  fastify.delete(
    "/api/reviews/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;
      const isAdmin = request.user!.role === "ADMIN";

      const existing = await prisma.review.findUnique({
        where: { id },
        select: { id: true, userId: true, productId: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: "Not Found", message: "Review not found" });
      }

      if (!isAdmin && existing.userId !== userId) {
        return reply.code(403).send({ error: "Forbidden", message: "You can only delete your own reviews" });
      }

      await prisma.review.delete({ where: { id } });

      // Recalculate product average rating
      await recalculateProductRating(existing.productId);

      return reply.code(204).send();
    },
  );

  // ─── POST /api/reviews/:id/helpful — Increment helpful count ───────────
  fastify.post(
    "/api/reviews/:id/helpful",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const existing = await prisma.review.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: "Not Found", message: "Review not found" });
      }

      const review = await prisma.review.update({
        where: { id },
        data: { helpfulCount: { increment: 1 } },
        select: { id: true, helpfulCount: true },
      });

      return reply.send({ data: review });
    },
  );
}
