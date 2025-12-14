# syntax=docker/dockerfile:1

# --- BASE STAGE ---
FROM node:20-slim AS base 

WORKDIR /app

# 1. Install libraries required for Canvas to run (and build if needed)
# "build-essential" allows compiling, others are graphics libraries.
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3

# 2. Skip Puppeteer download (we will install Chrome Stable in the final stage)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json package-lock.json ./

# 3. Install dependencies
# On 'slim', this will likely download a pre-built binary for canvas 
# instead of trying to compile it, solving your error immediately.
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

COPY . .

RUN npx prisma generate
RUN npm run build


# --- FINAL STAGE ---
FROM node:20-slim AS dev

WORKDIR /app

# 4. Install Google Chrome Stable (Best for Puppeteer)
# This command automatically installs all the fonts and shared libraries needed.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    # Add runtime libraries for Canvas (lighter than the -dev versions)
    libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgif7 librsvg2-2 \
    # Add fonts for international language support (Thai, Vietnamese, etc.)
    fonts-noto \
    && rm -rf /var/lib/apt/lists/*

# 5. Tell Puppeteer where Chrome is
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

COPY --from=base /app/dist /app/dist
COPY --from=base /app/templates /app/dist/templates
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json

EXPOSE 3001

CMD ["npm", "run", "start:dev"]