FROM node:24-alpine

WORKDIR /app

# openssl is required by the Prisma migration engine on Alpine
RUN apk add --no-cache openssl

# Copy manifests first for layer caching
COPY package*.json ./
COPY prisma ./prisma

# npm ci triggers postinstall → prisma generate automatically
RUN npm ci

# Copy the rest of the application source
COPY . .

EXPOSE 3000

# 1. Apply pending DB migrations
# 2. Seed initial data   (skipDuplicates = true, safe to re-run)
# 3. Start the API server (runs even if seed adds nothing new)
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js; node index.js"]
