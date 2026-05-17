const express = require("express");
const {asyncHandler} = require("../common/asyncHandler");
const {pool} = require("../config/prisma");
const {sendSuccess} = require("../common/response");

const router = express.Router();
const translate = (req, key) => (typeof req?.t === "function" ? req.t(key) : key);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Use pool.query directly — $queryRaw template literals are not supported
    // when Prisma uses a driver adapter (@prisma/adapter-pg).
    await pool.query("SELECT 1");
    return sendSuccess(res, translate(req, "health.ok"), {status: "ok"});
  })
);

module.exports = {healthRouter: router};
