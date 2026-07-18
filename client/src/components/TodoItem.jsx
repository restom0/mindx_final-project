import {AlarmClock, Check, Circle, Pencil, Play, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import {getPriority, getSubtaskProgress, isOverdue, isToday} from "../utils/productivity.js";
import Button from "./Button.jsx";

function TodoItem({todo, onDelete, onEdit, onFocus, onToggle}) {
  const {t} = useTranslation();
  if (!todo) {
    return null;
  }

  const progress = getSubtaskProgress(todo);
  const priority = getPriority(todo);
  const priorityLabel = `advanced.priority${priority[0].toUpperCase()}${priority.slice(1)}`;
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const hasDueDate = Boolean(dueDate && !Number.isNaN(dueDate.getTime()));
  const recurrenceType =
    typeof todo.recurrenceType === "string" ? todo.recurrenceType.toLowerCase() : "";

  return (
    <article
      className={`todo-item todo-item--${priority} ${todo.completed ? "todo-item--done" : ""}`}
    >
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
          <span className={`priority-pill priority-pill--${priority}`}>{t(priorityLabel)}</span>
        </div>
        <p>{todo.description || t("todo.noDescription")}</p>
        <div className="todo-item__meta">
          <span>{t("todo.version", {version: todo.version ?? 1})}</span>
          {hasDueDate ? (
            <span className={isOverdue(todo) ? "meta-danger" : isToday(todo) ? "meta-accent" : ""}>
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
        <div className="progress-bar" aria-label={t("advanced.progress", {progress})}>
          <span style={{width: `${progress}%`}} />
        </div>
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
