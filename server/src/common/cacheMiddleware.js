const {cache} = require("../config/cache");
const {env} = require("../config/env");

const cacheResponse = (keyFactory, ttlSeconds = env.cacheTtlSeconds) => {
  return async (req, res, next) => {
    const key = keyFactory(req);
    const cached = await cache.get(key);

    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.status(cached.statusCode).json(cached.body);
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode < 400) {
        cache.set(key, {statusCode: res.statusCode, body}, ttlSeconds);
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    return next();
  };
};

module.exports = {cacheResponse};
