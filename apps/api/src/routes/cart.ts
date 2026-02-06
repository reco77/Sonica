import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@sonica/database";
import { cartItemSchema } from "@sonica/shared";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(10),
});

export default async function cartRoutes(fastify: FastifyInstance): Promise<void> {
  // All cart routes require authentication
  fastify.addHook("preHandler", requireAuth);

  // ─── GET /api/cart — Get current user's cart ─────────────────────────────
  fastify.get("/api/cart", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user!.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                category: true,
                images: {
                  where: { type: "HERO" },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0,
    );

    return reply.send({
      data: {
        items: cartItems,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
      },
    });
  });

  // ─── POST /api/cart — Add item to cart ───────────────────────────────────
  fastify.post("/api/cart", async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = cartItemSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Validation Error",
        details: parsed.error.flatten(),
      });
    }

    const { variantId, quantity } = parsed.data;
    const userId = request.user!.id;

    // Verify variant exists and has sufficient stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: { select: { id: true, active: true } },
      },
    });

    if (!variant || !variant.product.active) {
      return reply.code(404).send({
        error: "Not Found",
        message: "Product variant not found or product is inactive",
      });
    }

    if (variant.stock < quantity) {
      return reply.code(400).send({
        error: "Insufficient Stock",
        message: `Only ${variant.stock} units available`,
      });
    }

    // Upsert cart item (add to existing quantity or create new)
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_variantId: { userId, variantId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        variantId,
        quantity,
      },
      include: {
        variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                images: { where: { type: "HERO" }, take: 1 },
              },
            },
          },
        },
      },
    });

    // Ensure we don't exceed max quantity
    if (cartItem.quantity > 10) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: 10 },
      });
      cartItem.quantity = 10;
    }

    return reply.code(201).send({ data: cartItem });
  });

  // ─── PUT /api/cart/:itemId — Update cart item quantity ───────────────────
  fastify.put("/api/cart/:itemId", async (request: FastifyRequest, reply: FastifyReply) => {
    const { itemId } = request.params as { itemId: string };
    const userId = request.user!.id;

    const parsed = updateCartItemSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Validation Error",
        details: parsed.error.flatten(),
      });
    }

    const { quantity } = parsed.data;

    const existing = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { variant: true },
    });

    if (!existing) {
      return reply.code(404).send({ error: "Not Found", message: "Cart item not found" });
    }

    if (existing.variant.stock < quantity) {
      return reply.code(400).send({
        error: "Insufficient Stock",
        message: `Only ${existing.variant.stock} units available`,
      });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                images: { where: { type: "HERO" }, take: 1 },
              },
            },
          },
        },
      },
    });

    return reply.send({ data: cartItem });
  });

  // ─── DELETE /api/cart/:itemId — Remove cart item ─────────────────────────
  fastify.delete("/api/cart/:itemId", async (request: FastifyRequest, reply: FastifyReply) => {
    const { itemId } = request.params as { itemId: string };
    const userId = request.user!.id;

    const existing = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!existing) {
      return reply.code(404).send({ error: "Not Found", message: "Cart item not found" });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return reply.code(204).send();
  });

  // ─── DELETE /api/cart — Clear cart ───────────────────────────────────────
  fastify.delete("/api/cart", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user!.id;

    await prisma.cartItem.deleteMany({ where: { userId } });

    return reply.code(204).send();
  });
}
