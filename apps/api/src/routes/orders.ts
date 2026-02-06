import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma, Prisma } from "@sonica/database";
import { shippingAddressSchema, orderStatusSchema } from "@sonica/shared";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { stripe } from "../lib/stripe";
import { z } from "zod";
import crypto from "crypto";

const createOrderBodySchema = z.object({
  shippingAddress: shippingAddressSchema,
});

const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  notes: z.string().optional(),
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SON-${timestamp}-${random}`;
}

export default async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/orders — Create order from cart ──────────────────────────
  fastify.post(
    "/api/orders",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = createOrderBodySchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const userId = request.user!.id;
      const { shippingAddress } = parsed.data;

      // Fetch user's cart items with variant and product details
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, active: true } },
            },
          },
        },
      });

      if (cartItems.length === 0) {
        return reply.code(400).send({
          error: "Empty Cart",
          message: "Your cart is empty",
        });
      }

      // Validate stock availability for each item
      for (const item of cartItems) {
        if (!item.variant.product.active) {
          return reply.code(400).send({
            error: "Product Unavailable",
            message: `Product "${item.variant.product.name}" is no longer available`,
          });
        }

        if (item.variant.stock < item.quantity) {
          return reply.code(400).send({
            error: "Insufficient Stock",
            message: `Only ${item.variant.stock} units of "${item.variant.product.name}" (${item.variant.color}) available`,
          });
        }
      }

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0,
      );
      const TAX_RATE = 0.08; // 8% tax
      const tax = Math.round(subtotal * TAX_RATE);
      const shippingCost = subtotal >= 10000 ? 0 : 999; // Free shipping over $100
      const total = subtotal + tax + shippingCost;

      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        metadata: {
          userId,
        },
      });

      // Create order in a transaction
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId,
            status: "PENDING",
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
            notes: `Payment Intent: ${paymentIntent.id}`,
            items: {
              create: cartItems.map((item) => ({
                variantId: item.variantId,
                productName: item.variant.product.name,
                variantColor: item.variant.color,
                quantity: item.quantity,
                priceAtPurchase: item.variant.price,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        // Decrement stock for each variant
        for (const item of cartItems) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Clear user's cart
        await tx.cartItem.deleteMany({ where: { userId } });

        return newOrder;
      });

      return reply.code(201).send({
        data: {
          order,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      });
    },
  );

  // ─── GET /api/orders — List user's orders ───────────────────────────────
  fastify.get(
    "/api/orders",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const query = request.query as { page?: string; limit?: string };

      const page = Math.max(1, parseInt(query.page || "1", 10));
      const limit = Math.min(50, Math.max(1, parseInt(query.limit || "10", 10)));
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      select: {
                        slug: true,
                        images: { where: { type: "HERO" }, take: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.order.count({ where: { userId } }),
      ]);

      return reply.send({
        data: orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
  );

  // ─── GET /api/orders/:id — Get order details ───────────────────────────
  fastify.get(
    "/api/orders/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;
      const isAdmin = request.user!.role === "ADMIN";

      const where: Prisma.OrderWhereUniqueInput = { id };

      const order = await prisma.order.findUnique({
        where,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      slug: true,
                      brand: true,
                      category: true,
                      images: { where: { type: "HERO" }, take: 1 },
                    },
                  },
                },
              },
            },
          },
          warranty: true,
        },
      });

      if (!order) {
        return reply.code(404).send({ error: "Not Found", message: "Order not found" });
      }

      // Non-admin users can only view their own orders
      if (!isAdmin && order.userId !== userId) {
        return reply.code(403).send({ error: "Forbidden", message: "Access denied" });
      }

      return reply.send({ data: order });
    },
  );

  // ─── PUT /api/orders/:id/status (admin) — Update order status ──────────
  fastify.put(
    "/api/orders/:id/status",
    { preHandler: [requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const parsed = updateOrderStatusSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const existing = await prisma.order.findUnique({
        where: { id },
        select: { id: true, status: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: "Not Found", message: "Order not found" });
      }

      const { status, trackingNumber, carrier, notes } = parsed.data;

      const updateData: Prisma.OrderUpdateInput = {
        status: status.toUpperCase() as Prisma.EnumOrderStatusFieldUpdateOperationsInput["set"],
      };

      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
      if (carrier !== undefined) updateData.carrier = carrier;
      if (notes !== undefined) updateData.notes = notes;

      const order = await prisma.order.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });

      return reply.send({ data: order });
    },
  );
}
