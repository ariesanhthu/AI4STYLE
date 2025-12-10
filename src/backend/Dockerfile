# syntax=docker/dockerfile:1

FROM node:20-alpine AS base 

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm cache clean --force && npm i

COPY prisma ./prisma
COPY prisma.config.ts ./

COPY . .

# RUN npx prisma migrate deploy 
RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS dev

WORKDIR /app

COPY --from=base /app/dist /app/dist
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
