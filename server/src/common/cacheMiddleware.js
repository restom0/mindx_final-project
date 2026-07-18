const {cache} = require("../config/cache");
const {env} = require("../config/env");

const normalizeCacheKey = (key) => {
  return typeof key === "string" && key.trim() ? key : "";
};

const isCachedResponse = (value) => {
  return Boolean(value && typeof value === "object" && Object.hasOwn(value, "body"));
};

const cacheResponse = (keyFactory, ttlSeconds = env.cacheTtlSeconds) => {
  return async (req, res, next) => {
    const key = normalizeCacheKey(typeof keyFactory === "function" ? keyFactory(req) : "");

    if (!key) {
      res.setHeader("X-Cache", "SKIP");
      return next();
    }

    let cached;
    try {
      cached = await cache.get(key);
    } catch {
      cached = null;
    }

    if (isCachedResponse(cached)) {
      res.setHeader("X-Cache", "HIT");
      return res
        .status(Number.isInteger(cached.statusCode) ? cached.statusCode : 200)
        .json(cached.body);
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode < 400) {
        cache.set(key, {statusCode: res.statusCode, body}, ttlSeconds).catch(() => undefined);
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    return next();
  };
};

module.exports = {cacheResponse};
