# syntax=docker/dockerfile:1

FROM node:20-alpine AS base 

WORKDIR /app

# 1. OPTIMIZATION: Tell Puppeteer NOT to download Chrome during npm install.
# We will use the system-installed Chromium later. This saves ~150MB and build time.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json package-lock.json ./

# Install dependencies (Puppeteer will now skip downloading its own browser)
RUN npm cache clean --force && npm i

COPY prisma ./prisma
COPY prisma.config.ts ./

COPY . .

RUN npx prisma generate
RUN npm run build


# --- Final Stage ---
FROM node:20-alpine AS dev

WORKDIR /app

# 2. INSTALLATION: Install Chromium and required font/graphics libraries
# These are strictly required for the browser to launch in Alpine.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# 3. CONFIGURATION: Point Puppeteer to the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=base /app/dist /app/dist
COPY --from=base /app/templates /app/dist/templates
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json
# Important: If your templates are in 'src/templates', check your nest-cli.json
# to ensure they are copied to 'dist'. If not, you might need to copy them manually here:
# COPY --from=base /app/src/templates /app/dist/templates

EXPOSE 3001

CMD ["npm", "run", "start:dev"]