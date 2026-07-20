import {useTranslation} from "react-i18next";
import {useVirtualList} from "../hooks/useVirtualList.js";
import TodoItem from "./TodoItem.jsx";

const ROW_HEIGHT = 168;

function TodoList({todos, onDelete, onEdit, onFocus, onToggle}) {
  const {t} = useTranslation();
  const items = Array.isArray(todos) ? todos : [];
  const {containerRef, onScroll, totalHeight, virtualItems} = useVirtualList({
    itemCount: items.length,
    itemHeight: ROW_HEIGHT,
    overscan: 6
  });

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>{t("todo.emptyTitle")}</h2>
        <p>{t("todo.emptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="todo-list" ref={containerRef} onScroll={onScroll}>
      <ul className="todo-list__spacer" style={{height: totalHeight}} aria-label={t("todo.list")}>
        {virtualItems.map((virtualItem) => {
          const todo = items[virtualItem.index];
          if (!todo) {
            return null;
          }

          return (
            <li
              className="todo-list__row"
              key={todo.id ?? `todo-row-${virtualItem.index}`}
              style={{transform: `translateY(${virtualItem.offsetTop}px)`}}
            >
              <TodoItem
                todo={todo}
                onDelete={onDelete}
                onEdit={onEdit}
                onFocus={onFocus}
                onToggle={onToggle}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TodoList;
