import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

// Route plugins
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import reviewRoutes from "./routes/reviews";
import searchRoutes from "./routes/search";
import compareRoutes from "./routes/compare";
import authRoutes from "./routes/auth";
import webhookRoutes from "./routes/webhooks";

const PORT = parseInt(process.env.PORT || "4000", 10);
const HOST = process.env.HOST || "0.0.0.0";

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
  });

  // ─── Global Plugins ────────────────────────────────────────────────────

  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Handled by the frontend
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (request) => {
      return request.headers["x-forwarded-for"] as string || request.ip;
    },
  });

  // ─── Raw Body Support (for Stripe Webhooks) ────────────────────────────

  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (req, body, done) => {
      try {
        // Attach raw body for webhook verification
        (req as unknown as Record<string, unknown>).rawBody = body;
        const json = JSON.parse(body.toString());
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    },
  );

  // ─── Health Check ──────────────────────────────────────────────────────

  fastify.get("/api/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // ─── Route Plugins ────────────────────────────────────────────────────

  await fastify.register(authRoutes);
  await fastify.register(productRoutes);
  await fastify.register(cartRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(reviewRoutes);
  await fastify.register(searchRoutes);
  await fastify.register(compareRoutes);
  await fastify.register(webhookRoutes);

  // ─── Global Error Handler ─────────────────────────────────────────────

  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    fastify.log.error(error);

    // Fastify rate limit error
    if (error.statusCode === 429) {
      return reply.code(429).send({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
      });
    }

    // Zod / validation errors
    if (error.validation) {
      return reply.code(400).send({
        error: "Validation Error",
        message: error.message,
      });
    }

    // Default error
    const statusCode = error.statusCode || 500;
    return reply.code(statusCode).send({
      error: statusCode >= 500 ? "Internal Server Error" : error.message,
      message:
        statusCode >= 500
          ? "An unexpected error occurred"
          : error.message,
    });
  });

  // ─── 404 Handler ──────────────────────────────────────────────────────

  fastify.setNotFoundHandler((_request, reply) => {
    reply.code(404).send({
      error: "Not Found",
      message: "The requested resource was not found",
    });
  });

  return fastify;
}

// ─── Start Server ─────────────────────────────────────────────────────────

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Sonica API server running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // ─── Graceful Shutdown ──────────────────────────────────────────────────

  const shutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}. Shutting down gracefully...`);

    try {
      await fastify.close();
      fastify.log.info("Server closed");
      process.exit(0);
    } catch (err) {
      fastify.log.error(err, "Error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
