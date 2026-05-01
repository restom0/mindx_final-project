const {env} = require("../config/env");
const {HttpError} = require("./httpError");

const notFoundHandler = (req, _res, next) => {
  next(new HttpError(404, req.t("errors.notFound"), {path: req.originalUrl}));
};

const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const payload = {
    message: statusCode >= 500 ? req.t("errors.server") : error.message
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (env.nodeEnv === "development" && statusCode >= 500) {
    payload.debug = error.message;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {errorHandler, notFoundHandler};
