FROM node:24-alpine

WORKDIR /app

# OpenSSL is required by the Prisma migration engine on Alpine.
RUN apk add --no-cache openssl

# Copy manifests and Prisma schema first for layer caching.
COPY package*.json ./
COPY prisma ./prisma

# npm ci triggers postinstall, which generates the Prisma client.
RUN npm ci

# Copy only runtime application files to avoid packaging local secrets or build output.
COPY --chown=node:node index.js prisma.config.ts ./
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma

EXPOSE 3000

USER node

# 1. Apply pending DB migrations.
# 2. Seed initial data; repeated runs are safe.
# 3. Start the API server even if seeding adds nothing new.
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node prisma/seed.js; node index.js"]
