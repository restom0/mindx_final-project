import {useEffect, useState} from "react";
import {Save, Sparkles} from "lucide-react";
import {useTranslation} from "react-i18next";
import {fromDateInputValue, parseSmartTask, toDateInputValue} from "../utils/smartTask.js";
import Button from "./Button.jsx";
import Input from "./Input.jsx";

function TodoForm({initialTodo, isSaving, onCancel, onSubmit}) {
  const {t} = useTranslation();
  const [smartInput, setSmartInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [important, setImportant] = useState(false);
  const [status, setStatus] = useState("todo");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [recurrenceType, setRecurrenceType] = useState("none");
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const [subtasksText, setSubtasksText] = useState("");
  const [attachmentLabel, setAttachmentLabel] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [ownerId, setOwnerId] = useState("owner-1");
  const [assigneeId, setAssigneeId] = useState("");
  const [locationText, setLocationText] = useState("");

  useEffect(() => {
    setTitle(initialTodo?.title || "");
    setDescription(initialTodo?.description || "");
    setPriority((initialTodo?.priority || "medium").toLowerCase());
    setImportant(Boolean(initialTodo?.important));
    setStatus((initialTodo?.status || "todo").toLowerCase());
    setCategory(initialTodo?.category || "General");
    setDueDate(toDateInputValue(initialTodo?.dueDate));
    setReminderAt(toDateInputValue(initialTodo?.reminderAt));
    setRecurrenceType((initialTodo?.recurrenceType || "none").toLowerCase());
    setEstimatedMinutes(initialTodo?.estimatedMinutes || 25);
    setSubtasksText((initialTodo?.subtasks || []).map((subtask) => subtask.title).join("\n"));
    const firstAttachment = initialTodo?.attachments?.[0];
    setAttachmentLabel(firstAttachment?.label || "");
    setAttachmentUrl(firstAttachment?.url || "");
    setOwnerId(initialTodo?.ownerId || "owner-1");
    setAssigneeId(initialTodo?.assigneeId || "");
    setLocationText(
      initialTodo?.locationReminder
        ? `${initialTodo.locationReminder.latitude}, ${initialTodo.locationReminder.longitude}, ${initialTodo.locationReminder.radius}`
        : ""
    );
  }, [initialTodo]);

  const applySmartInput = () => {
    const parsed = parseSmartTask(smartInput);
    setTitle(parsed.title);
    setPriority(parsed.priority);
    setImportant(parsed.important);
    setDueDate(parsed.dueDate);
    setReminderAt(parsed.reminderAt);
    setRecurrenceType(parsed.recurrenceType);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const [latitude, longitude, radius] = locationText
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      important,
      status,
      category: category.trim() || "General",
      dueDate: fromDateInputValue(dueDate),
      reminderAt: fromDateInputValue(reminderAt),
      recurrenceType,
      estimatedMinutes: Number(estimatedMinutes) || 25,
      subtasks: subtasksText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item, index) => ({
          title: item,
          completed: initialTodo?.subtasks?.[index]?.completed || false,
          sortOrder: index
        })),
      attachments: attachmentLabel
        ? [
          {
            type: attachmentUrl ? "link" : "note",
            label: attachmentLabel.trim(),
            url: attachmentUrl.trim(),
            metadata: {uploadStatus: "placeholder"}
          }
        ]
        : [],
      locationReminder:
        Number.isFinite(latitude) && Number.isFinite(longitude)
          ? {
            latitude,
            longitude,
            radius: radius || 250,
            triggerType: "arrive"
          }
          : null,
      collaboration: {
        ownerId,
        assigneeId: assigneeId || null,
        sharedWith: assigneeId ? [{userId: assigneeId, role: "editor"}] : []
      }
    });
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="smart-input">
        <Input
          id="smart-task-input"
          label={t("advanced.smartInput")}
          placeholder={t("advanced.smartPlaceholder")}
          value={smartInput}
          onChange={(event) => setSmartInput(event.target.value)}
        />
        <Button icon={<Sparkles size={18}/>} variant="secondary" onClick={applySmartInput}
                disabled={!smartInput.trim()}>
          {t("advanced.parse")}
        </Button>
      </div>

      <Input
        id="todo-title"
        label={t("todo.fields.title")}
        placeholder={t("todo.fields.titlePlaceholder")}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={160}
        required
      />

      <label className="field" htmlFor="todo-description">
        <span className="field__label">{t("todo.fields.description")}</span>
        <textarea
          className="field__control field__control--textarea"
          id="todo-description"
          placeholder={t("todo.fields.descriptionPlaceholder")}
          value={description}
          maxLength={1000}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <div className="form-grid">
        <label className="field" htmlFor="todo-priority">
          <span className="field__label">{t("advanced.priority")}</span>
          <select className="field__control" id="todo-priority" value={priority}
                  onChange={(event) => setPriority(event.target.value)}>
            <option value="low">{t("advanced.priorityLow")}</option>
            <option value="medium">{t("advanced.priorityMedium")}</option>
            <option value="high">{t("advanced.priorityHigh")}</option>
            <option value="urgent">{t("advanced.priorityUrgent")}</option>
          </select>
        </label>

        <label className="field" htmlFor="todo-status">
          <span className="field__label">{t("advanced.status")}</span>
          <select className="field__control" id="todo-status" value={status}
                  onChange={(event) => setStatus(event.target.value)}>
            <option value="backlog">{t("advanced.backlog")}</option>
            <option value="todo">{t("advanced.todo")}</option>
            <option value="in_progress">{t("advanced.inProgress")}</option>
            <option value="done">{t("advanced.done")}</option>
          </select>
        </label>

        <Input id="todo-category" label={t("advanced.category")} value={category}
               onChange={(event) => setCategory(event.target.value)}/>
        <Input
          id="todo-estimate"
          label={t("advanced.estimate")}
          type="number"
          min="1"
          value={estimatedMinutes}
          onChange={(event) => setEstimatedMinutes(event.target.value)}
        />

        <Input id="todo-due" label={t("advanced.dueDate")} type="datetime-local" value={dueDate}
               onChange={(event) => setDueDate(event.target.value)}/>
        <Input id="todo-reminder" label={t("advanced.reminder")} type="datetime-local" value={reminderAt}
               onChange={(event) => setReminderAt(event.target.value)}/>

        <label className="field" htmlFor="todo-repeat">
          <span className="field__label">{t("advanced.repeat")}</span>
          <select className="field__control" id="todo-repeat" value={recurrenceType}
                  onChange={(event) => setRecurrenceType(event.target.value)}>
            <option value="none">{t("advanced.repeatNone")}</option>
            <option value="daily">{t("advanced.repeatDaily")}</option>
            <option value="weekly">{t("advanced.repeatWeekly")}</option>
            <option value="monthly">{t("advanced.repeatMonthly")}</option>
            <option value="custom">{t("advanced.repeatCustom")}</option>
          </select>
        </label>

        <label className="field field--checkbox">
          <input type="checkbox" checked={important} onChange={(event) => setImportant(event.target.checked)}/>
          <span>{t("advanced.important")}</span>
        </label>
      </div>

      <label className="field" htmlFor="todo-subtasks">
        <span className="field__label">{t("advanced.subtasks")}</span>
        <textarea
          className="field__control field__control--textarea"
          id="todo-subtasks"
          placeholder={t("advanced.subtasksPlaceholder")}
          value={subtasksText}
          onChange={(event) => setSubtasksText(event.target.value)}
        />
      </label>

      <div className="form-grid">
        <Input id="attachment-label" label={t("advanced.attachment")} value={attachmentLabel}
               onChange={(event) => setAttachmentLabel(event.target.value)}/>
        <Input id="attachment-url" label={t("advanced.attachmentUrl")} value={attachmentUrl}
               onChange={(event) => setAttachmentUrl(event.target.value)}/>
        <Input id="owner-id" label={t("advanced.owner")} value={ownerId}
               onChange={(event) => setOwnerId(event.target.value)}/>
        <Input id="assignee-id" label={t("advanced.assignee")} value={assigneeId}
               onChange={(event) => setAssigneeId(event.target.value)}/>
      </div>

      <Input
        id="location-reminder"
        label={t("advanced.locationReminder")}
        helper={t("advanced.locationPlaceholder")}
        value={locationText}
        onChange={(event) => setLocationText(event.target.value)}
      />

      <div className="todo-form__actions">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        ) : null}
        <Button icon={<Save size={18}/>} disabled={!title.trim() || isSaving} type="submit">
          {isSaving ? t("common.saving") : t(initialTodo ? "todo.actions.save" : "todo.actions.add")}
        </Button>
      </div>
    </form>
  );
}

export default TodoForm;
