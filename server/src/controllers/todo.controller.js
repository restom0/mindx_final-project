const {sendSuccess} = require("../common/response");
const {todoService} = require("../services/todo.service");

const translate = (req, key) => {
  if (typeof req?.t === "function") {
    return req.t(key);
  }

  return key;
};

const getTranslator = (req) => {
  if (typeof req?.t === "function") {
    return req.t;
  }

  return (key) => key;
};

const todoController = {
  async list(req, res) {
    const result = await todoService.list(req.validated.query);

    return sendSuccess(
      res,
      translate(req, "todo.list.success"),
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
    const todo = await todoService.detail(req.validated.params.id, getTranslator(req));
    return sendSuccess(res, translate(req, "todo.detail.success"), todo);
  },

  async create(req, res) {
    const todo = await todoService.create(req.validated.body);
    return sendSuccess(res, translate(req, "todo.created"), todo, undefined, 201);
  },

  async update(req, res) {
    const todo = await todoService.update(
      req.validated.params.id,
      req.validated.body,
      getTranslator(req)
    );
    return sendSuccess(res, translate(req, "todo.updated"), todo);
  },

  async remove(req, res) {
    const todo = await todoService.remove(req.validated.params.id, getTranslator(req));
    return sendSuccess(res, translate(req, "todo.deleted"), todo);
  },

  async clear(req, res) {
    const result = await todoService.clear();
    return sendSuccess(res, translate(req, "todo.cleared"), {count: result.count});
  },

  async createFocusSession(req, res) {
    const session = await todoService.createFocusSession(req.validated.body);
    return sendSuccess(res, translate(req, "focus.created"), session, undefined, 201);
  },

  async listHabits(req, res) {
    const habits = await todoService.listHabits();
    return sendSuccess(res, translate(req, "habit.list.success"), habits);
  },

  async createHabit(req, res) {
    const habit = await todoService.createHabit(req.validated.body);
    return sendSuccess(res, translate(req, "habit.created"), habit, undefined, 201);
  },

  async checkInHabit(req, res) {
    const checkIn = await todoService.checkInHabit(
      req.validated.params.habitId,
      req.validated.body.date
    );
    return sendSuccess(res, translate(req, "habit.checked"), checkIn);
  },

  async aiBreakdown(req, res) {
    const result = todoService.getAiBreakdown(req.validated.body);
    return sendSuccess(res, translate(req, "ai.breakdown.success"), result);
  }
};

module.exports = {todoController};
