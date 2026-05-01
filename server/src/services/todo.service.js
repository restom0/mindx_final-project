const {Prisma} = require("@prisma/client");
const {cache} = require("../config/cache");
const {HttpError} = require("../common/httpError");
const {todoRepository} = require("../repositories/todo.repository");

const TODO_CACHE_PREFIX = "todos:";

const throwNotFound = (t) => {
  throw new HttpError(404, t("todo.notFound"));
};

const invalidateTodos = () => cache.purgeByPrefix(TODO_CACHE_PREFIX);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const getNextDueDate = (todo) => {
  const base = todo.dueDate ? new Date(todo.dueDate) : new Date();
  const interval = todo.repeatRule?.interval || 1;
  const customUnit = todo.repeatRule?.unit || "day";

  switch (todo.recurrenceType) {
    case "DAILY":
      return addDays(base, interval);
    case "WEEKLY":
      return addDays(base, interval * 7);
    case "MONTHLY":
      return addMonths(base, interval);
    case "CUSTOM":
      if (customUnit === "week") {
        return addDays(base, interval * 7);
      }
      if (customUnit === "month") {
        return addMonths(base, interval);
      }
      return addDays(base, interval);
    default:
      return null;
  }
};

const applyCompletionRules = async (id, data, t) => {
  if (data.completed !== true) {
    return data.completed === false ? {...data, status: data.status || "TODO"} : data;
  }

  const current = await todoRepository.findById(id);
  if (!current) {
    throwNotFound(t);
  }

  if (current.recurrenceType && current.recurrenceType !== "NONE") {
    const nextDueDate = getNextDueDate(current);
    return {
      ...data,
      completed: false,
      status: "TODO",
      dueDate: nextDueDate,
      reminderAt: nextDueDate
        ? new Date(nextDueDate.getTime() - 30 * 60 * 1000)
        : current.reminderAt
    };
  }

  return {
    ...data,
    status: data.status || "DONE"
  };
};

const buildAiBreakdown = ({title = "", description = ""}) => {
  const source = `${title} ${description}`.toLowerCase();
  const estimatedMinutes = source.includes("project") || source.includes("launch") ? 180 : 75;
  const priority = source.includes("urgent") || source.includes("deadline") ? "URGENT" : "HIGH";

  return {
    title,
    priority,
    estimatedMinutes,
    subtasks: [
      `Clarify the outcome for "${title}"`,
      "Collect required inputs and constraints",
      "Break the work into the smallest shippable step",
      "Review the result and note follow-up actions"
    ],
    checklist: [
      "Definition of done is clear",
      "Owner and due date are visible",
      "Next action can be completed in one focus session"
    ]
  };
};

const todoService = {
  async list(query) {
    return todoRepository.findMany(query);
  },

  async detail(id, t) {
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throwNotFound(t);
    }
    return todo;
  },

  async create(data) {
    const todo = await todoRepository.create(data);
    await invalidateTodos();
    return todo;
  },

  async update(id, data, t) {
    try {
      const updateData = await applyCompletionRules(id, data, t);
      const todo = await todoRepository.update(id, updateData);
      await invalidateTodos();
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throwNotFound(t);
      }
      throw error;
    }
  },

  async remove(id, t) {
    try {
      const todo = await todoRepository.delete(id);
      await invalidateTodos();
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throwNotFound(t);
      }
      throw error;
    }
  },

  async clear() {
    const result = await todoRepository.deleteMany();
    await invalidateTodos();
    return result;
  },

  async createFocusSession(data) {
    const session = await todoRepository.createFocusSession({
      ...data,
      mode: data.mode || "FOCUS"
    });
    await invalidateTodos();
    return session;
  },

  listHabits() {
    return todoRepository.listHabits();
  },

  createHabit(data) {
    return todoRepository.createHabit(data);
  },

  checkInHabit(habitId, date) {
    const checkInDate = new Date(date);
    checkInDate.setHours(0, 0, 0, 0);
    return todoRepository.checkInHabit(habitId, checkInDate);
  },

  getAiBreakdown(input) {
    return buildAiBreakdown(input);
  }
};

module.exports = {TODO_CACHE_PREFIX, todoService};
