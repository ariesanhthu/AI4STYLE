# syntax=docker/dockerfile:1

FROM node:20-alpine AS dev
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm cache clean --force && npm ci

COPY . .
ENV NODE_ENV=development NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-p", "3000"]