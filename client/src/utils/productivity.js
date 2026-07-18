const ensureArray = (value) => (Array.isArray(value) ? value : []);
const toValidDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getSubtaskProgress = (todo) => {
  const subtasks = ensureArray(todo?.subtasks);
  if (subtasks.length === 0) {
    return todo?.completed ? 100 : 0;
  }
  const completed = subtasks.filter((subtask) => subtask.completed).length;
  return Math.round((completed / subtasks.length) * 100);
};

export const isOverdue = (todo) => {
  const dueDate = toValidDate(todo?.dueDate);
  return Boolean(dueDate && !todo?.completed && dueDate < new Date());
};

export const isToday = (todo) => {
  const due = toValidDate(todo?.dueDate);
  if (!due) {
    return false;
  }
  const now = new Date();
  return due.toDateString() === now.toDateString();
};

export const getPriority = (todo) => {
  const priority = typeof todo?.priority === "string" ? todo.priority.toLowerCase() : "medium";
  return ["low", "medium", "high", "urgent"].includes(priority) ? priority : "medium";
};

export const getMatrixKey = (todo) => {
  const urgent = ["urgent", "high"].includes(getPriority(todo)) || isOverdue(todo) || isToday(todo);
  const important = Boolean(todo?.important);

  if (urgent && important) {
    return "do";
  }
  if (!urgent && important) {
    return "schedule";
  }
  if (urgent && !important) {
    return "delegate";
  }
  return "eliminate";
};

export const getDailyPlan = (todos) => {
  return [...ensureArray(todos)]
    .filter((todo) => !todo.completed)
    .sort((a, b) => {
      const aScore =
        (isOverdue(a) ? 5 : 0) + (isToday(a) ? 4 : 0) + (getPriority(a) === "urgent" ? 3 : 0);
      const bScore =
        (isOverdue(b) ? 5 : 0) + (isToday(b) ? 4 : 0) + (getPriority(b) === "urgent" ? 3 : 0);
      return bScore - aScore;
    })
    .slice(0, 5);
};

export const getCompletionRate = (todos) => {
  const items = ensureArray(todos);
  if (items.length === 0) {
    return 0;
  }
  return Math.round((items.filter((todo) => todo.completed).length / items.length) * 100);
};
