import {useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Card from "../components/Card.jsx";
import QuoteCard from "../components/QuoteCard.jsx";
import {fetchTodos, selectTodos, selectTodoStatus} from "../features/todos/todosSlice.js";

const toTimestamp = (value) => {
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
};

function InsightsPage() {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const todos = useSelector(selectTodos);
  const status = useSelector(selectTodoStatus);
  const todoItems = useMemo(() => (Array.isArray(todos) ? todos : []), [todos]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [dispatch, status]);

  const insights = useMemo(() => {
    const total = todoItems.length;
    const completed = todoItems.filter((todo) => todo.completed).length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const latest = [...todoItems]
      .sort((a, b) => toTimestamp(b?.updatedAt) - toTimestamp(a?.updatedAt))
      .slice(0, 5);

    return {completed, completionRate, latest, total};
  }, [todoItems]);

  return (
    <div className="page page--insights">
      <section className="hero hero--compact">
        <div className="hero__content">
          <span>{t("insights.kicker")}</span>
          <h1>{t("insights.title")}</h1>
          <p>{t("insights.subtitle")}</p>
        </div>
      </section>

      <div className="insights-grid">
        <Card className="metrics-card">
          <h2>{t("insights.progress")}</h2>
          <div
            className="progress-ring"
            aria-label={t("insights.rate", {rate: insights.completionRate})}
          >
            <span>{insights.completionRate}%</span>
          </div>
          <p>{t("insights.completed", {completed: insights.completed, total: insights.total})}</p>
        </Card>

        <Card className="activity-card">
          <h2>{t("insights.latest")}</h2>
          <ul>
            {insights.latest.map((todo) => (
              <li key={todo.id}>
                <span>{todo.title || ""}</span>
                <time dateTime={todo.updatedAt || ""}>
                  {toTimestamp(todo?.updatedAt)
                    ? new Intl.DateTimeFormat(undefined, {dateStyle: "medium"}).format(
                        new Date(todo.updatedAt)
                      )
                    : ""}
                </time>
              </li>
            ))}
          </ul>
        </Card>

        <QuoteCard />
      </div>
    </div>
  );
}

export default InsightsPage;
