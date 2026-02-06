#!/bin/bash
set -e

echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h postgres -U sonica -q 2>/dev/null; do
  sleep 1
done
echo "✅ PostgreSQL ready"

echo "⏳ Waiting for Redis..."
until redis-cli -h redis ping 2>/dev/null | grep -q PONG; do
  sleep 1
done
echo "✅ Redis ready"

echo "📦 Pushing database schema..."
npm run db:push

echo "🌱 Seeding database..."
npm run db:seed || echo "Seed already exists or skipped"

echo "🚀 Starting dev servers..."
npm run dev
