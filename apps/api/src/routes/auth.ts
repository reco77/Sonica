import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@sonica/database";
import { requireAuth, signToken } from "../middleware/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(300),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().max(300).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).max(128).optional(),
});

const SALT_ROUNDS = 12;

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // ─── POST /api/auth/register — Register with email/password ─────────────
  fastify.post("/api/auth/register", async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Validation Error",
        details: parsed.error.flatten(),
      });
    }

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return reply.code(409).send({
        error: "Conflict",
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.code(201).send({
      data: {
        user,
        token,
      },
    });
  });

  // ─── POST /api/auth/login — Login, return JWT token ─────────────────────
  fastify.post("/api/auth/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Validation Error",
        details: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Exclude passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return reply.send({
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  });

  // ─── GET /api/auth/me — Get current user profile ────────────────────────
  fastify.get(
    "/api/auth/me",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
          addresses: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      });

      if (!user) {
        return reply.code(404).send({ error: "Not Found", message: "User not found" });
      }

      return reply.send({ data: user });
    },
  );

  // ─── PUT /api/auth/me — Update profile ──────────────────────────────────
  fastify.put(
    "/api/auth/me",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;

      const parsed = updateProfileSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "Validation Error",
          details: parsed.error.flatten(),
        });
      }

      const data = parsed.data;

      // If changing email, check it is not taken
      if (data.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
          select: { id: true },
        });

        if (existingUser && existingUser.id !== userId) {
          return reply.code(409).send({
            error: "Conflict",
            message: "This email is already in use by another account",
          });
        }
      }

      // If changing password, verify current password
      if (data.newPassword) {
        if (!data.currentPassword) {
          return reply.code(400).send({
            error: "Validation Error",
            message: "Current password is required to set a new password",
          });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { passwordHash: true },
        });

        if (!user?.passwordHash) {
          return reply.code(400).send({
            error: "Validation Error",
            message: "Cannot change password for this account type",
          });
        }

        const isValidPassword = await bcrypt.compare(data.currentPassword, user.passwordHash);

        if (!isValidPassword) {
          return reply.code(401).send({
            error: "Unauthorized",
            message: "Current password is incorrect",
          });
        }
      }

      // Build update data
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      if (data.newPassword) {
        updateData.passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // If email changed, issue a new token
      let token: string | undefined;
      if (data.email && data.email !== request.user!.email) {
        token = signToken({
          userId: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        });
      }

      return reply.send({
        data: {
          user: updatedUser,
          ...(token ? { token } : {}),
        },
      });
    },
  );
}
