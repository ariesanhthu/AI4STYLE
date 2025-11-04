# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
# Prefer package-lock.json for reproducible installs. If you don't have
# a lockfile yet, run `npm install` locally to generate one and commit it.
COPY package.json package-lock.json ./
# Use npm ci to install from lockfile (faster and reproducible)
RUN npm ci

# Copy prisma schema and generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Development target (uses source with hot-reload via compose)
FROM base AS dev
COPY . .
ENV PORT=3001 NODE_ENV=development
EXPOSE 3001
# Generate Prisma Client and optionally run migrations, then start dev server
# Use --skip-generate since we already generated in base stage
CMD npx prisma migrate deploy && npm run start:dev

# Build target
FROM base AS build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production PORT=3001
# Copy lockfile for reproducible production install
COPY package.json package-lock.json ./
# Install only production dependencies
RUN npm ci --only=production

# Copy prisma schema and generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

COPY --from=build /app/dist ./dist
EXPOSE 3001
# Run migrations before starting the app
CMD npx prisma migrate deploy && node dist/main.js
