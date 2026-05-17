const {HttpError} = require("./httpError");

const fallbackMessages = {
  "errors.invalidField": "Invalid field",
  "errors.validation": "Validation failed"
};

const translate = (req, key) => {
  if (typeof req?.t === "function") {
    return req.t(key);
  }

  return fallbackMessages[key] || key;
};

const validate = (schema, source) => (req, _res, next) => {
  const parsed = schema.safeParse(req?.[source]);

  if (!parsed.success) {
    const details = (parsed.error?.issues || []).map((issue) => ({
      path: Array.isArray(issue.path) ? issue.path.join(".") : "",
      code: issue.code,
      message: translate(req, "errors.invalidField")
    }));
    return next(new HttpError(400, translate(req, "errors.validation"), details));
  }

  req.validated = req.validated || {};
  req.validated[source] = parsed.data;
  return next();
};

module.exports = {validate};
