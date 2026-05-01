import {ArrowDownAZ, ArrowUpAZ, Search} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectTodoFilters, setFilter, setSearch, setSort} from "../features/todos/todosSlice.js";
import Button from "./Button.jsx";

const filterKeys = ["all", "active", "completed"];

function TodoToolbar() {
  const dispatch = useDispatch();
  const filters = useSelector(selectTodoFilters);
  const {t} = useTranslation();
  const isAscending = filters.order === "asc";

  return (
    <section className="todo-toolbar" aria-label={t("todo.toolbar")}>
      <div className="segmented-control">
        {filterKeys.map((filter) => (
          <button
            aria-pressed={filters.filter === filter}
            className="segmented-control__item"
            key={filter}
            type="button"
            onClick={() => dispatch(setFilter(filter))}
          >
            {t(`todo.filters.${filter}`)}
          </button>
        ))}
      </div>

      <label className="search-field">
        <Search size={18} aria-hidden="true"/>
        <span className="sr-only">{t("todo.search")}</span>
        <input
          value={filters.search}
          placeholder={t("todo.searchPlaceholder")}
          onChange={(event) => dispatch(setSearch(event.target.value))}
        />
      </label>

      <label className="select-control select-control--wide">
        <span>{t("todo.sort.label")}</span>
        <select
          value={filters.sort}
          onChange={(event) => dispatch(setSort({sort: event.target.value, order: filters.order}))}
        >
          <option value="createdAt">{t("todo.sort.createdAt")}</option>
          <option value="updatedAt">{t("todo.sort.updatedAt")}</option>
          <option value="title">{t("todo.sort.title")}</option>
        </select>
      </label>

      <Button
        icon={isAscending ? <ArrowUpAZ size={18}/> : <ArrowDownAZ size={18}/>}
        variant="secondary"
        onClick={() => dispatch(setSort({sort: filters.sort, order: isAscending ? "desc" : "asc"}))}
      >
        {isAscending ? t("todo.sort.asc") : t("todo.sort.desc")}
      </Button>
    </section>
  );
}

export default TodoToolbar;
