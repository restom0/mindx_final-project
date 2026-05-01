FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:deploy && npm run seed && npm start"]
