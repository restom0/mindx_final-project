import {Plus} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Button from "../components/Button.jsx";
import AdvancedWorkspace from "../components/AdvancedWorkspace.jsx";
import Card from "../components/Card.jsx";
import FocusMode from "../components/FocusMode.jsx";
import Modal from "../components/Modal.jsx";
import QuoteCard from "../components/QuoteCard.jsx";
import Skeleton from "../components/Skeleton.jsx";
import TodoForm from "../components/TodoForm.jsx";
import TodoList from "../components/TodoList.jsx";
import TodoToolbar from "../components/TodoToolbar.jsx";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  selectTodoError,
  selectTodoFilters,
  selectTodoMeta,
  selectTodos,
  selectTodoSaving,
  selectTodoStatus,
  updateTodo
} from "../features/todos/todosSlice.js";
import {selectLanguage} from "../features/settings/settingsSlice.js";
import {awardCompletion, recordFocusSession} from "../features/productivity/productivitySlice.js";
import {todoApi} from "../services/todoApi.js";

function TodoPage() {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const todos = useSelector(selectTodos);
  const status = useSelector(selectTodoStatus);
  const saving = useSelector(selectTodoSaving);
  const error = useSelector(selectTodoError);
  const meta = useSelector(selectTodoMeta);
  const filters = useSelector(selectTodoFilters);
  const language = useSelector(selectLanguage);
  const [editingTodo, setEditingTodo] = useState(null);
  const [focusTask, setFocusTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      dispatch(fetchTodos());
    }, 180);

    return () => window.clearTimeout(handle);
  }, [dispatch, filters, language]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      completed,
      active: todos.length - completed
    };
  }, [todos]);

  const openCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTodo(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingTodo) {
        await dispatch(updateTodo({id: editingTodo.id, changes: payload})).unwrap();
      } else {
        await dispatch(createTodo(payload)).unwrap();
      }
      dispatch(fetchTodos());
      closeModal();
    } catch {
      // Redux state already carries the translated server/client error.
    }
  };

  const handleToggle = async (todo) => {
    try {
      await dispatch(updateTodo({id: todo.id, changes: {completed: !todo.completed}})).unwrap();
      if (!todo.completed) {
        dispatch(awardCompletion());
      }
      dispatch(fetchTodos());
    } catch {
      // Redux state already carries the translated server/client error.
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      dispatch(fetchTodos());
    } catch {
      // Redux state already carries the translated server/client error.
    }
  };

  const handleMoveTask = async (id, changes) => {
    const normalizedChanges = {
      ...changes,
      completed: changes.status === "DONE" ? true : changes.completed
    };
    try {
      await dispatch(updateTodo({id, changes: normalizedChanges})).unwrap();
      dispatch(fetchTodos());
    } catch {
      // Redux state already carries the translated server/client error.
    }
  };

  const handleApplyAi = async (result) => {
    try {
      await dispatch(
        createTodo({
          title: result.title,
          description: result.checklist.join("\n"),
          priority: result.priority.toLowerCase(),
          estimatedMinutes: result.estimatedMinutes,
          subtasks: result.subtasks.map((title, index) => ({title, completed: false, sortOrder: index}))
        })
      ).unwrap();
      dispatch(fetchTodos());
    } catch {
      // Redux state already carries the translated server/client error.
    }
  };

  const handleRecordFocus = (session) => {
    dispatch(recordFocusSession(session));
    todoApi.createFocusSession(session, language).catch(() => undefined);
  };

  return (
    <div className="page page--todos">
      <section className="hero">
        <div className="hero__content">
          <span>{t("app.kicker")}</span>
          <h1>{t("app.headline")}</h1>
          <p>{t("app.subtitle")}</p>
        </div>
        <Button icon={<Plus size={18}/>} onClick={openCreateModal}>
          {t("todo.actions.add")}
        </Button>
      </section>

      <div className="dashboard-grid">
        <Card className="todo-panel">
          <div className="panel-header">
            <div>
              <h2>{t("todo.title")}</h2>
              <p>{t("todo.summary", {active: stats.active, completed: stats.completed})}</p>
            </div>
            {meta ? <span className="meta-pill">{t("todo.total", {total: meta.total})}</span> : null}
          </div>

          <TodoToolbar/>

          {error ? <p className="alert alert--danger">{error}</p> : null}
          {status === "loading" ? (
            <Skeleton rows={5}/>
          ) : (
            <TodoList
              todos={todos}
              onDelete={handleDelete}
              onEdit={(todo) => {
                setEditingTodo(todo);
                setIsModalOpen(true);
              }}
              onFocus={setFocusTask}
              onToggle={handleToggle}
            />
          )}
        </Card>

        <aside className="side-stack">
          <FocusMode task={focusTask} onRecord={handleRecordFocus}/>
          <QuoteCard/>
          <Card className="metrics-card">
            <h2>{t("metrics.title")}</h2>
            <dl>
              <div>
                <dt>{t("metrics.active")}</dt>
                <dd>{stats.active}</dd>
              </div>
              <div>
                <dt>{t("metrics.completed")}</dt>
                <dd>{stats.completed}</dd>
              </div>
              <div>
                <dt>{t("metrics.cached")}</dt>
                <dd>{status === "refreshing" ? t("common.refreshing") : t("common.ready")}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>

      <AdvancedWorkspace todos={todos} onApplyAi={handleApplyAi} onMoveTask={handleMoveTask}/>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTodo ? t("todo.editTitle") : t("todo.createTitle")}
      >
        <TodoForm initialTodo={editingTodo} isSaving={saving} onCancel={closeModal} onSubmit={handleSubmit}/>
      </Modal>
    </div>
  );
}

export default TodoPage;
