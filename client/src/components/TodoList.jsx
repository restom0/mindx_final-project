import {useTranslation} from "react-i18next";
import {useVirtualList} from "../hooks/useVirtualList.js";
import TodoItem from "./TodoItem.jsx";

const ROW_HEIGHT = 168;

function TodoList({todos, onDelete, onEdit, onFocus, onToggle}) {
  const {t} = useTranslation();
  const {containerRef, onScroll, totalHeight, virtualItems} = useVirtualList({
    itemCount: todos.length,
    itemHeight: ROW_HEIGHT,
    overscan: 6
  });

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <h2>{t("todo.emptyTitle")}</h2>
        <p>{t("todo.emptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="todo-list" ref={containerRef} onScroll={onScroll} role="list" aria-label={t("todo.list")}>
      <div className="todo-list__spacer" style={{height: totalHeight}}>
        {virtualItems.map((virtualItem) => {
          const todo = todos[virtualItem.index];
          return (
            <div
              className="todo-list__row"
              key={todo.id}
              role="listitem"
              style={{transform: `translateY(${virtualItem.offsetTop}px)`}}
            >
              <TodoItem todo={todo} onDelete={onDelete} onEdit={onEdit} onFocus={onFocus} onToggle={onToggle}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodoList;
