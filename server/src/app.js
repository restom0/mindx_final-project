const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const {errorHandler, notFoundHandler} = require("./common/errorHandler");
const {i18nMiddleware} = require("./common/i18n");
const {apiRateLimiter} = require("./common/rateLimiters");
const {env} = require("./config/env");
const {swaggerMiddleware} = require("./config/swagger");
const {apiRouter} = require("./routes");

const app = express();

if (env.trustProxy) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true
  })
);
app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({extended: true}));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(i18nMiddleware);

app.use(`${env.apiPrefix}/docs`, apiRateLimiter, swaggerMiddleware);
app.use(env.apiPrefix, apiRateLimiter, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {app};
