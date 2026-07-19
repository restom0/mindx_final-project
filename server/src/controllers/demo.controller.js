const {HttpError} = require("../common/httpError");
const {sendSuccess} = require("../common/response");
const {env} = require("../config/env");
const {seedDemoData} = require("../services/demoData.service");

const translate = (req, key) => {
  if (typeof req?.t === "function") {
    return req.t(key);
  }

  return key;
};

const demoController = {
  async seed(req, res) {
    if (!env.demoModeEnabled) {
      throw new HttpError(403, translate(req, "demo.disabled"));
    }

    const result = await seedDemoData(req.validated.body);
    return sendSuccess(res, translate(req, "demo.seeded"), result, undefined, 201);
  }
};

module.exports = {demoController};
