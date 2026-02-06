# Sonica

Premium tech accessories e-commerce platform — headphones, smartwatches, earbuds, and speakers.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Zustand, TanStack Query
- **Backend**: Fastify 5, TypeScript, Prisma, Stripe, Meilisearch
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Search**: Meilisearch
- **Monorepo**: Turborepo + npm workspaces

## Project Structure

```
apps/
  web/          → Next.js storefront        (port 3000)
  api/          → Fastify REST API          (port 4000)
  admin/        → Admin dashboard           (port 3001)
packages/
  shared/       → Shared types, Zod schemas, constants
  product-specs/→ Per-category spec definitions
  database/     → Prisma schema + client
  ui/           → Shared React components
  config/       → Shared ESLint/TS configs
```

## Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- npm >= 10

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url> sonica
cd sonica
npm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (5432), Redis (6379), and Meilisearch (7700).

### 3. Set up environment

```bash
cp .env.example .env
```

Edit `.env` with your Stripe keys and other config. The database URL defaults to the Docker Compose PostgreSQL instance.

### 4. Initialize database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start development

```bash
npm run dev
```

This starts all apps concurrently:
- Storefront: http://localhost:3000
- API: http://localhost:4000
- Admin: http://localhost:3001
- Meilisearch dashboard: http://localhost:7700

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in dev mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all apps and packages |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `docker compose up -d` | Start PostgreSQL + Redis + Meilisearch |
| `docker compose down` | Stop infrastructure |

## Sample Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@sonica.com | admin123 |
| Customer | customer@sonica.com | customer123 |
