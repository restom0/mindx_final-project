import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Crown,
  Flame,
  GripVertical,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Sparkles,
  Trophy
} from "lucide-react";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectLanguage} from "../features/settings/settingsSlice.js";
import {addHabit, checkInHabit, selectProductivity} from "../features/productivity/productivitySlice.js";
import {todoApi} from "../services/todoApi.js";
import {getCompletionRate, getDailyPlan, getMatrixKey, getPriority, isOverdue, isToday} from "../utils/productivity.js";
import Button from "./Button.jsx";
import Card from "./Card.jsx";
import Input from "./Input.jsx";

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const matrixGroups = [
  {key: "do", label: "advanced.matrixDo"},
  {key: "schedule", label: "advanced.matrixSchedule"},
  {key: "delegate", label: "advanced.matrixDelegate"},
  {key: "eliminate", label: "advanced.matrixEliminate"}
];

const kanbanColumns = [
  {key: "BACKLOG", label: "advanced.backlog"},
  {key: "TODO", label: "advanced.todo"},
  {key: "IN_PROGRESS", label: "advanced.inProgress"},
  {key: "DONE", label: "advanced.done"}
];

const weekDays = Array.from({length: 7}, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index);
  date.setHours(9, 0, 0, 0);
  return date;
});

function MiniTask({todo}) {
  if (!todo) {
    return null;
  }

  return (
    <span className={`mini-task mini-task--${getPriority(todo)} ${isOverdue(todo) ? "mini-task--overdue" : ""}`}>
      {todo.title || ""}
    </span>
  );
}

function DailyPlanner({todos}) {
  const {t} = useTranslation();
  const plan = getDailyPlan(ensureArray(todos));

  return (
    <Card className="advanced-card">
      <h2>{t("advanced.myDay")}</h2>
      <p>{t("advanced.myDayHint")}</p>
      <div className="task-chip-list">
        {plan.map((todo) => (
          <MiniTask key={todo.id} todo={todo}/>
        ))}
      </div>
    </Card>
  );
}

function EisenhowerMatrix({todos}) {
  const {t} = useTranslation();
  const groups = useMemo(() => {
    return matrixGroups.reduce((acc, group) => {
      acc[group.key] = ensureArray(todos)
        .filter((todo) => getMatrixKey(todo) === group.key)
        .slice(0, 6);
      return acc;
    }, {do: [], schedule: [], delegate: [], eliminate: []});
  }, [todos]);

  return (
    <Card className="advanced-card advanced-card--wide">
      <h2>{t("advanced.matrix")}</h2>
      <div className="matrix-grid">
        {matrixGroups.map((group) => (
          <section key={group.key}>
            <h3>{t(group.label)}</h3>
            {(groups[group.key] || []).map((todo) => (
              <MiniTask key={todo.id} todo={todo}/>
            ))}
          </section>
        ))}
      </div>
    </Card>
  );
}

function KanbanBoard({todos, onMove}) {
  const {t} = useTranslation();
  const items = ensureArray(todos);

  return (
    <Card className="advanced-card advanced-card--wide">
      <h2>{t("advanced.kanban")}</h2>
      <div className="kanban-board">
        {kanbanColumns.map((column) => (
          <section
            className="kanban-column"
            key={column.key}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const id = event.dataTransfer?.getData("text/plain");
              if (id) {
                onMove?.(id, {status: column.key});
              }
            }}
          >
            <h3>{t(column.label)}</h3>
            {items
              .filter((todo) => (todo.status || "TODO") === column.key)
              .slice(0, 8)
              .map((todo) => (
                <div className="kanban-card" draggable key={todo.id}
                     onDragStart={(event) => event.dataTransfer?.setData("text/plain", todo.id || "")}>
                  <GripVertical size={14}/>
                  <span>{todo.title || ""}</span>
                </div>
              ))}
          </section>
        ))}
      </div>
    </Card>
  );
}

function CalendarView({todos, onMove}) {
  const {t} = useTranslation();
  const items = ensureArray(todos);

  return (
    <Card className="advanced-card advanced-card--wide">
      <h2>{t("advanced.calendar")}</h2>
      <div className="calendar-strip">
        {weekDays.map((day) => {
          const key = day.toISOString().slice(0, 10);
          const tasks = items.filter((todo) => String(todo?.dueDate ?? "").slice(0, 10) === key);
          return (
            <section
              className={`calendar-day ${day.toDateString() === new Date().toDateString() ? "calendar-day--today" : ""}`}
              key={key}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer?.getData("text/plain");
                if (id) {
                  onMove?.(id, {dueDate: day.toISOString()});
                }
              }}
            >
              <h3>{new Intl.DateTimeFormat(undefined, {weekday: "short", day: "numeric"}).format(day)}</h3>
              {tasks.slice(0, 5).map((todo) => (
                <div className="calendar-task" draggable key={todo.id}
                     onDragStart={(event) => event.dataTransfer?.setData("text/plain", todo.id || "")}>
                  {isToday(todo) ? <CalendarDays size={14}/> : null}
                  {todo.title || ""}
                </div>
              ))}
              {tasks.length === 0 ? <span className="muted">{t("advanced.dropHere")}</span> : null}
            </section>
          );
        })}
      </div>
    </Card>
  );
}

function AiTaskBreakdown({onApply}) {
  const {t} = useTranslation();
  const language = useSelector(selectLanguage);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const response = await todoApi.aiBreakdown({title}, language);
      setResult(response?.data ?? null);
    } catch {
      setResult({
        title,
        priority: "HIGH",
        estimatedMinutes: 90,
        subtasks: ["Define success", "Split into milestones", "Do the first 25 minutes"],
        checklist: ["Owner is clear", "Due date exists", "Next action is visible"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="advanced-card">
      <h2>
        <Bot size={18}/> {t("advanced.ai")}
      </h2>
      <Input id="ai-title" label={t("advanced.bigTask")} value={title}
             onChange={(event) => setTitle(event.target.value)}/>
      <Button icon={<Sparkles size={16}/>} onClick={generate} disabled={!title.trim() || loading}>
        {loading ? t("common.refreshing") : t("advanced.generate")}
      </Button>
      {result ? (
        <div className="ai-result">
          <p>{t("advanced.aiEstimate", {minutes: result?.estimatedMinutes ?? 0, priority: result?.priority ?? ""})}</p>
          <ul>
            {ensureArray(result?.subtasks).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button variant="secondary" onClick={() => onApply?.(result)}>
            {t("advanced.applyAi")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function HabitTracker() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {habits} = useSelector(selectProductivity);
  const [title, setTitle] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card className="advanced-card">
      <h2>
        <Flame size={18}/> {t("advanced.habits")}
      </h2>
      <div className="inline-form">
        <Input id="habit-title" label={t("advanced.habitName")} value={title}
               onChange={(event) => setTitle(event.target.value)}/>
        <Button onClick={() => {
          const nextTitle = title.trim();
          if (!nextTitle) {
            return;
          }

          dispatch(addHabit({title: nextTitle}));
          setTitle("");
        }} disabled={!title.trim()}>
          {t("advanced.addHabit")}
        </Button>
      </div>
      {ensureArray(habits).map((habit) => {
        const checkIns = ensureArray(habit?.checkIns);
        const checked = checkIns.some((checkIn) => checkIn?.date === today);
        const rate = Math.min(100, Math.round((checkIns.length / 7) * 100));
        return (
          <div className="habit-row" key={habit.id}>
            <div>
              <strong>{habit.title || ""}</strong>
              <span>{t("advanced.streak", {streak: checkIns.length})} - {rate}%</span>
            </div>
            <Button variant={checked ? "secondary" : "primary"} onClick={() => dispatch(checkInHabit(habit.id))}
                    disabled={checked}>
              {checked ? t("advanced.checked") : t("advanced.checkIn")}
            </Button>
          </div>
        );
      })}
    </Card>
  );
}

function ProductivityDashboard({todos}) {
  const {t} = useTranslation();
  const {badges, focusSessions, habits, level, score, lastCongratulation} = useSelector(selectProductivity);
  const items = ensureArray(todos);
  const completed = items.filter((todo) => todo.completed).length;
  const overdue = items.filter(isOverdue).length;
  const focusTime = ensureArray(focusSessions).reduce((sum, session) => sum + (Number(session?.durationMinutes) || 0), 0);
  const rate = getCompletionRate(items);

  return (
    <Card className="advanced-card advanced-card--wide">
      <h2>
        <LayoutDashboard size={18}/> {t("advanced.productivity")}
      </h2>
      <div className="dashboard-metrics">
        <span>{t("advanced.completedCount", {count: completed})}</span>
        <span>{t("advanced.overdueCount", {count: overdue})}</span>
        <span>{t("advanced.completionRate", {rate})}</span>
        <span>{t("advanced.focusMinutes", {minutes: focusTime})}</span>
        <span>{t("advanced.habitCount", {count: ensureArray(habits).length})}</span>
      </div>
      <div className="score-card">
        <Trophy size={20}/>
        <strong>{t("advanced.level", {level})}</strong>
        <span>{t("advanced.score", {score})}</span>
        {ensureArray(badges).map((badge) => (
          <em key={badge}>{badge}</em>
        ))}
      </div>
      {lastCongratulation ? <p className="celebration">{lastCongratulation}</p> : null}
    </Card>
  );
}

function CollaborationPlaceholders() {
  const {t} = useTranslation();

  return (
    <Card className="advanced-card">
      <h2>
        <MessageSquare size={18}/> {t("advanced.collaboration")}
      </h2>
      <ul className="placeholder-list">
        <li>{t("advanced.sharedLists")}</li>
        <li>{t("advanced.commentsMentions")}</li>
        <li>{t("advanced.activityLog")}</li>
        <li>{t("advanced.roles")}</li>
      </ul>
      <p className="muted">
        <MapPin size={14}/> {t("advanced.locationNote")}
      </p>
    </Card>
  );
}

function GamificationCard() {
  const {t} = useTranslation();
  const {badges, level, score} = useSelector(selectProductivity);
  const badgeItems = ensureArray(badges);

  return (
    <Card className="advanced-card">
      <h2>
        <Crown size={18}/> {t("advanced.gamification")}
      </h2>
      <p>{t("advanced.level", {level})}</p>
      <p>{t("advanced.score", {score})}</p>
      <div className="badge-list">
        {(badgeItems.length ? badgeItems : [t("advanced.firstBadge")]).map((badge) => (
          <span key={badge}>
            <CheckCircle2 size={14}/> {badge}
          </span>
        ))}
      </div>
    </Card>
  );
}

function AdvancedWorkspace({todos, onApplyAi, onMoveTask}) {
  return (
    <div className="advanced-grid">
      <DailyPlanner todos={todos}/>
      <AiTaskBreakdown onApply={onApplyAi}/>
      <HabitTracker/>
      <ProductivityDashboard todos={todos}/>
      <EisenhowerMatrix todos={todos}/>
      <CalendarView todos={todos} onMove={onMoveTask}/>
      <KanbanBoard todos={todos} onMove={onMoveTask}/>
      <CollaborationPlaceholders/>
      <GamificationCard/>
    </div>
  );
}

export default AdvancedWorkspace;
