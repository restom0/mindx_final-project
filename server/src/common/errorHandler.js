const {env} = require("../config/env");
const {HttpError} = require("./httpError");

const fallbackMessages = {
  "errors.notFound": "Resource not found",
  "errors.server": "Something went wrong on the server",
  "errors.validation": "Validation failed"
};

const translate = (req, key) => {
  if (typeof req?.t === "function") {
    return req.t(key);
  }

  return fallbackMessages[key] || key;
};

const notFoundHandler = (req, _res, next) => {
  next(new HttpError(404, translate(req, "errors.notFound"), {path: req?.originalUrl || ""}));
};

const errorHandler = (error, req, res, _next) => {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  const payload = {
    message:
      statusCode >= 500
        ? translate(req, "errors.server")
        : error?.message || translate(req, "errors.validation")
  };

  if (error?.details) {
    payload.details = error.details;
  }

  if (env.nodeEnv === "development" && statusCode >= 500 && error?.message) {
    payload.debug = error.message;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {errorHandler, notFoundHandler};
