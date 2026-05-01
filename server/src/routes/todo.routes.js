const express = require("express");
const {asyncHandler} = require("../common/asyncHandler");
const {cacheResponse} = require("../common/cacheMiddleware");
const {validate} = require("../common/validate");
const {todoController} = require("../controllers/todo.controller");
const {
  aiBreakdownSchema,
  createHabitSchema,
  createTodoSchema,
  focusSessionSchema,
  habitCheckInSchema,
  habitIdParamsSchema,
  todoIdParamsSchema,
  todoQuerySchema,
  updateTodoSchema
} = require("../dto/todo.dto");
const {TODO_CACHE_PREFIX} = require("../services/todo.service");

const router = express.Router();

router.get(
  "/",
  validate(todoQuerySchema, "query"),
  cacheResponse((req) => `${TODO_CACHE_PREFIX}list:${req.locale}:${req.originalUrl}`),
  asyncHandler(todoController.list)
);

router.post("/", validate(createTodoSchema, "body"), asyncHandler(todoController.create));

router.delete("/", asyncHandler(todoController.clear));

router.post(
  "/focus-sessions",
  validate(focusSessionSchema, "body"),
  asyncHandler(todoController.createFocusSession)
);

router.get(
  "/:id",
  validate(todoIdParamsSchema, "params"),
  cacheResponse((req) => `${TODO_CACHE_PREFIX}detail:${req.locale}:${req.params.id}`),
  asyncHandler(todoController.detail)
);

router.patch(
  "/:id",
  validate(todoIdParamsSchema, "params"),
  validate(updateTodoSchema, "body"),
  asyncHandler(todoController.update)
);

router.delete(
  "/:id",
  validate(todoIdParamsSchema, "params"),
  asyncHandler(todoController.remove)
);

const habitRouter = express.Router();

habitRouter.get("/", asyncHandler(todoController.listHabits));
habitRouter.post("/", validate(createHabitSchema, "body"), asyncHandler(todoController.createHabit));
habitRouter.post(
  "/:habitId/check-ins",
  validate(habitIdParamsSchema, "params"),
  validate(habitCheckInSchema, "body"),
  asyncHandler(todoController.checkInHabit)
);

const aiRouter = express.Router();

aiRouter.post(
  "/task-breakdown",
  validate(aiBreakdownSchema, "body"),
  asyncHandler(todoController.aiBreakdown)
);

module.exports = {aiRouter, habitRouter, todoRouter: router};
