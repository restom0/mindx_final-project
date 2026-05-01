const {HttpError} = require("./httpError");

const validate = (schema, source) => (req, _res, next) => {
  const parsed = schema.safeParse(req[source]);

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
      message: req.t("errors.invalidField")
    }));
    return next(new HttpError(400, req.t("errors.validation"), details));
  }

  req.validated = req.validated || {};
  req.validated[source] = parsed.data;
  return next();
};

module.exports = {validate};
