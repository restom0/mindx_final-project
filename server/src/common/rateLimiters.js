const rateLimit = require("express-rate-limit");
const {env} = require("../config/env");

const tooManyRequestsMessage = {
  message: "Too many requests. Please wait a moment before trying again."
};

const createLimiter = ({max, windowMs}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: tooManyRequestsMessage
  });

const apiRateLimiter = createLimiter({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax
});

const healthRateLimiter = createLimiter({
  windowMs: env.healthRateLimitWindowMs,
  max: env.healthRateLimitMax
});

module.exports = {apiRateLimiter, healthRateLimiter};
