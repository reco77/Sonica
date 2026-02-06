import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { prisma } from "@sonica/database";

const JWT_SECRET = process.env.JWT_SECRET || "sonica-dev-secret";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

/**
 * Extract and verify JWT from the Authorization header.
 * Returns the decoded payload or null if invalid/missing.
 */
export function verifyToken(authHeader: string | undefined): JwtPayload | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Signs a JWT for the given user payload.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Fastify preHandler hook that validates JWT and attaches user to request.
 * Returns 401 if token is missing or invalid.
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const payload = verifyToken(request.headers.authorization);

  if (!payload) {
    reply.code(401).send({ error: "Unauthorized", message: "Valid authentication token required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    reply.code(401).send({ error: "Unauthorized", message: "User not found" });
    return;
  }

  request.user = user;
}

/**
 * Fastify preHandler hook that checks if authenticated user has ADMIN role.
 * Must be used after requireAuth.
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await requireAuth(request, reply);

  if (reply.sent) return;

  if (request.user?.role !== "ADMIN") {
    reply.code(403).send({ error: "Forbidden", message: "Admin access required" });
    return;
  }
}

/**
 * Optional auth - attaches user if token is present but does not reject.
 */
export async function optionalAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const payload = verifyToken(request.headers.authorization);
  if (!payload) return;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (user) {
    request.user = user;
  }
}
