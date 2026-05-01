const dotenv = require("dotenv");

dotenv.config({quiet: true});

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 3000),
  apiPrefix: process.env.API_PREFIX || "/api",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || "",
  cacheTtlSeconds: toNumber(process.env.CACHE_TTL_SECONDS, 60)
};

module.exports = {env};
