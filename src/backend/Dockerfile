# syntax=docker/dockerfile:1

FROM node:20-alpine AS dev
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm cache clean --force && npm ci


COPY prisma ./prisma

COPY . .

ENV PORT=3001 NODE_ENV=development
EXPOSE 3001

CMD npx prisma migrate deploy && npx prisma generate && npm run start:dev
