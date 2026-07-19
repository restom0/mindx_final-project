const express = require("express");
const {asyncHandler} = require("../common/asyncHandler");
const {validate} = require("../common/validate");
const {demoController} = require("../controllers/demo.controller");
const {demoSeedSchema} = require("../dto/demo.dto");

const demoRouter = express.Router();

demoRouter.post("/seed", validate(demoSeedSchema, "body"), asyncHandler(demoController.seed));

module.exports = {demoRouter};
