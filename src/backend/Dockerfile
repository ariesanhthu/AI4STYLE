# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
# Prefer package-lock.json for reproducible installs. If you don't have
# a lockfile yet, run `npm install` locally to generate one and commit it.
COPY package.json package-lock.json ./
# Use npm ci to install from lockfile (faster and reproducible)
RUN npm ci

# Development target (uses source with hot-reload via compose)
FROM base AS dev
COPY . .
ENV PORT=3001 NODE_ENV=development
EXPOSE 3001
# Use npm to run the development command
CMD ["npm", "run", "start:dev"]

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
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]
