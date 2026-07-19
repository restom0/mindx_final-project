const express = require("express");
const {demoRouter} = require("./demo.routes");
const {healthRouter} = require("./health.routes");
const {aiRouter, habitRouter, todoRouter} = require("./todo.routes");

const router = express.Router();

router.use("/health", healthRouter);
router.use("/demo", demoRouter);
router.use("/todos", todoRouter);
router.use("/habits", habitRouter);
router.use("/ai", aiRouter);

module.exports = {apiRouter: router};
