const Redis = require("ioredis");
const {env} = require("./env");

const memoryCache = new Map();
let redisClient = null;

if (env.redisUrl) {
  redisClient = new Redis(env.redisUrl, {
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });

  redisClient.connect().catch(() => {
    redisClient = null;
  });
}

const isFresh = (entry) => entry && entry.expiresAt > Date.now();

const cache = {
  async get(key) {
    if (redisClient?.status === "ready") {
      try {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    }

    const entry = memoryCache.get(key);
    if (!isFresh(entry)) {
      memoryCache.delete(key);
      return null;
    }

    return entry.value;
  },

  async set(key, value, ttlSeconds = env.cacheTtlSeconds) {
    if (redisClient?.status === "ready") {
      try {
        await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
        return;
      } catch {
        // Fall back to process memory below.
      }
    }

    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  },

  async purgeByPrefix(prefix) {
    if (redisClient?.status === "ready") {
      try {
        let cursor = "0";
        do {
          const [nextCursor, keys] = await redisClient.scan(
            cursor,
            "MATCH",
            `${prefix}*`,
            "COUNT",
            100
          );
          cursor = nextCursor;
          if (keys.length > 0) {
            await redisClient.del(keys);
          }
        } while (cursor !== "0");
      } catch {
        // Memory cache is still purged below.
      }
    }

    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  },

  async disconnect() {
    if (redisClient) {
      await redisClient.quit().catch(() => undefined);
    }
  }
};

module.exports = {cache};
