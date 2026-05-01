export const getSubtaskProgress = (todo) => {
  const subtasks = todo.subtasks || [];
  if (subtasks.length === 0) {
    return todo.completed ? 100 : 0;
  }
  const completed = subtasks.filter((subtask) => subtask.completed).length;
  return Math.round((completed / subtasks.length) * 100);
};

export const isOverdue = (todo) => {
  return Boolean(todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date());
};

export const isToday = (todo) => {
  if (!todo.dueDate) {
    return false;
  }
  const due = new Date(todo.dueDate);
  const now = new Date();
  return due.toDateString() === now.toDateString();
};

export const getPriority = (todo) => (todo.priority || "MEDIUM").toLowerCase();

export const getMatrixKey = (todo) => {
  const urgent = ["urgent", "high"].includes(getPriority(todo)) || isOverdue(todo) || isToday(todo);
  const important = Boolean(todo.important);

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
  return [...todos]
    .filter((todo) => !todo.completed)
    .sort((a, b) => {
      const aScore = (isOverdue(a) ? 5 : 0) + (isToday(a) ? 4 : 0) + (getPriority(a) === "urgent" ? 3 : 0);
      const bScore = (isOverdue(b) ? 5 : 0) + (isToday(b) ? 4 : 0) + (getPriority(b) === "urgent" ? 3 : 0);
      return bScore - aScore;
    })
    .slice(0, 5);
};

export const getCompletionRate = (todos) => {
  if (todos.length === 0) {
    return 0;
  }
  return Math.round((todos.filter((todo) => todo.completed).length / todos.length) * 100);
};
