import {AlarmClock, Check, Circle, Pencil, Play, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import {getPriority, getSubtaskProgress, isOverdue, isToday} from "../utils/productivity.js";
import Button from "./Button.jsx";

const getPriorityLabel = (priority) =>
  `advanced.priority${priority[0].toUpperCase()}${priority.slice(1)}`;

const getDueDate = (todo) => {
  if (!todo?.dueDate) {
    return null;
  }

  const date = new Date(todo.dueDate);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDueDateClassName = (todo) => {
  if (isOverdue(todo)) {
    return "meta-danger";
  }

  return isToday(todo) ? "meta-accent" : "";
};

const getRecurrenceType = (todo) =>
  typeof todo?.recurrenceType === "string" ? todo.recurrenceType.toLowerCase() : "";

const getTodoItemClassName = (priority, completed) => {
  const classes = ["todo-item", `todo-item--${priority}`];
  if (completed) {
    classes.push("todo-item--done");
  }
  return classes.join(" ");
};

function TodoItem({todo, onDelete, onEdit, onFocus, onToggle}) {
  const {t} = useTranslation();
  if (!todo) {
    return null;
  }

  const progress = getSubtaskProgress(todo);
  const priority = getPriority(todo);
  const dueDate = getDueDate(todo);
  const recurrenceType = getRecurrenceType(todo);

  return (
    <article className={getTodoItemClassName(priority, todo.completed)}>
      <button
        className="todo-item__check"
        type="button"
        aria-label={todo.completed ? t("todo.actions.markActive") : t("todo.actions.complete")}
        onClick={() => onToggle?.(todo)}
      >
        {todo.completed ? <Check size={18} /> : <Circle size={18} />}
      </button>

      <div className="todo-item__content">
        <div className="todo-item__title-row">
          <h3>{todo.title || ""}</h3>
          <span className={`priority-pill priority-pill--${priority}`}>
            {t(getPriorityLabel(priority))}
          </span>
        </div>
        <p>{todo.description || t("todo.noDescription")}</p>
        <div className="todo-item__meta">
          <span>{t("todo.version", {version: todo.version ?? 1})}</span>
          {dueDate ? (
            <span className={getDueDateClassName(todo)}>
              <AlarmClock size={14} />{" "}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
              }).format(dueDate)}
            </span>
          ) : null}
          {recurrenceType && recurrenceType !== "none" ? <span>{recurrenceType}</span> : null}
          {todo.assigneeId ? <span>@{todo.assigneeId}</span> : null}
        </div>
        <progress
          className="progress-bar"
          max={100}
          value={progress}
          aria-label={t("advanced.progress", {progress})}
        >
          {progress}%
        </progress>
      </div>

      <div className="todo-item__actions">
        <Button
          icon={<Play size={16} />}
          variant="secondary"
          size="sm"
          onClick={() => onFocus?.(todo)}
        >
          {t("advanced.focus")}
        </Button>
        <Button
          icon={<Pencil size={16} />}
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(todo)}
        >
          {t("todo.actions.edit")}
        </Button>
        <Button
          icon={<Trash2 size={16} />}
          variant="danger"
          size="sm"
          onClick={() => onDelete?.(todo.id)}
        >
          {t("todo.actions.delete")}
        </Button>
      </div>
    </article>
  );
}

export default TodoItem;
