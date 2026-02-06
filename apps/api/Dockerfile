FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY packages/config/package.json ./packages/config/
RUN npm ci --workspace=@sonica/api

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
RUN npx turbo build --filter=@sonica/api

# Production
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sonica
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/node_modules ./node_modules
USER sonica
EXPOSE 4000
ENV PORT=4000
CMD ["node", "apps/api/dist/server.js"]
