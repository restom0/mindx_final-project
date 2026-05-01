const express = require("express");
const {asyncHandler} = require("../common/asyncHandler");
const {prisma} = require("../config/prisma");
const {sendSuccess} = require("../common/response");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(res, req.t("health.ok"), {status: "ok"});
  })
);

module.exports = {healthRouter: router};
