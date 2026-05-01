const {sendSuccess} = require("../common/response");
const {todoService} = require("../services/todo.service");

const todoController = {
  async list(req, res) {
    const result = await todoService.list(req.validated.query);

    return sendSuccess(
      res,
      req.t("todo.list.success"),
      result.items,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    );
  },

  async detail(req, res) {
    const todo = await todoService.detail(req.validated.params.id, req.t);
    return sendSuccess(res, req.t("todo.detail.success"), todo);
  },

  async create(req, res) {
    const todo = await todoService.create(req.validated.body);
    return sendSuccess(res, req.t("todo.created"), todo, undefined, 201);
  },

  async update(req, res) {
    const todo = await todoService.update(
      req.validated.params.id,
      req.validated.body,
      req.t
    );
    return sendSuccess(res, req.t("todo.updated"), todo);
  },

  async remove(req, res) {
    const todo = await todoService.remove(req.validated.params.id, req.t);
    return sendSuccess(res, req.t("todo.deleted"), todo);
  },

  async clear(req, res) {
    const result = await todoService.clear();
    return sendSuccess(res, req.t("todo.cleared"), {count: result.count});
  },

  async createFocusSession(req, res) {
    const session = await todoService.createFocusSession(req.validated.body);
    return sendSuccess(res, req.t("focus.created"), session, undefined, 201);
  },

  async listHabits(req, res) {
    const habits = await todoService.listHabits();
    return sendSuccess(res, req.t("habit.list.success"), habits);
  },

  async createHabit(req, res) {
    const habit = await todoService.createHabit(req.validated.body);
    return sendSuccess(res, req.t("habit.created"), habit, undefined, 201);
  },

  async checkInHabit(req, res) {
    const checkIn = await todoService.checkInHabit(
      req.validated.params.habitId,
      req.validated.body.date
    );
    return sendSuccess(res, req.t("habit.checked"), checkIn);
  },

  async aiBreakdown(req, res) {
    const result = todoService.getAiBreakdown(req.validated.body);
    return sendSuccess(res, req.t("ai.breakdown.success"), result);
  }
};

module.exports = {todoController};
