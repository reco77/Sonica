import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@sonica/database";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export default async function webhookRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/webhooks/stripe — Handle Stripe webhook events ──────────
  fastify.post(
    "/api/webhooks/stripe",
    {
      config: {
        // Raw body is needed for Stripe signature verification
        rawBody: true,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sig = request.headers["stripe-signature"] as string | undefined;

      if (!sig) {
        return reply.code(400).send({ error: "Missing stripe-signature header" });
      }

      let event: Stripe.Event;

      try {
        // Use raw body for signature verification
        const rawBody = (request as FastifyRequest & { rawBody?: Buffer }).rawBody;

        if (!rawBody) {
          return reply.code(400).send({ error: "Missing raw body for webhook verification" });
        }

        event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        fastify.log.error(`Webhook signature verification failed: ${message}`);
        return reply.code(400).send({ error: `Webhook Error: ${message}` });
      }

      fastify.log.info({ type: event.type, id: event.id }, "Stripe webhook received");

      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentSucceeded(fastify, paymentIntent);
          break;
        }

        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentFailed(fastify, paymentIntent);
          break;
        }

        default:
          fastify.log.info(`Unhandled event type: ${event.type}`);
      }

      return reply.code(200).send({ received: true });
    },
  );
}

/**
 * Handle successful payment: update order status to CONFIRMED.
 */
async function handlePaymentSucceeded(
  fastify: FastifyInstance,
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const paymentIntentId = paymentIntent.id;

  // Find order by payment intent ID stored in notes
  const order = await prisma.order.findFirst({
    where: {
      notes: { contains: paymentIntentId },
      status: "PENDING",
    },
    select: { id: true },
  });

  if (!order) {
    fastify.log.warn(
      { paymentIntentId },
      "No pending order found for payment intent",
    );
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "CONFIRMED" },
  });

  fastify.log.info(
    { orderId: order.id, paymentIntentId },
    "Order confirmed after successful payment",
  );
}

/**
 * Handle failed payment: update order status to CANCELLED and restore stock.
 */
async function handlePaymentFailed(
  fastify: FastifyInstance,
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const paymentIntentId = paymentIntent.id;

  const order = await prisma.order.findFirst({
    where: {
      notes: { contains: paymentIntentId },
      status: "PENDING",
    },
    select: { id: true },
    include: { items: true },
  });

  if (!order) {
    fastify.log.warn(
      { paymentIntentId },
      "No pending order found for failed payment intent",
    );
    return;
  }

  // Restore stock and cancel order in a transaction
  await prisma.$transaction(async (tx) => {
    // Type the order items properly
    const fullOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    if (!fullOrder) return;

    // Restore stock for each variant
    for (const item of fullOrder.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Cancel the order
    await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
  });

  fastify.log.info(
    { orderId: order.id, paymentIntentId },
    "Order cancelled after payment failure, stock restored",
  );
}
