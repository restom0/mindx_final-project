import {useEffect, useState} from "react";
import {Save, Sparkles} from "lucide-react";
import {useTranslation} from "react-i18next";
import {fromDateInputValue, parseSmartTask, toDateInputValue} from "../utils/smartTask.js";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Select from "./Select.jsx";
import Textarea from "./Textarea.jsx";

const ensureArray = (value) => (Array.isArray(value) ? value : []);

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
    const subtasks = ensureArray(initialTodo?.subtasks);
    const attachments = ensureArray(initialTodo?.attachments);
    const firstAttachment = attachments[0];
    const locationReminder = initialTodo?.locationReminder;
    const hasLocation =
      Number.isFinite(locationReminder?.latitude) && Number.isFinite(locationReminder?.longitude);

    setTitle(initialTodo?.title || "");
    setDescription(initialTodo?.description || "");
    setPriority((initialTodo?.priority || "medium").toLowerCase());
    setImportant(Boolean(initialTodo?.important));
    setStatus((initialTodo?.status || "todo").toLowerCase());
    setCategory(initialTodo?.category || "General");
    setDueDate(toDateInputValue(initialTodo?.dueDate));
    setReminderAt(toDateInputValue(initialTodo?.reminderAt));
    setRecurrenceType((initialTodo?.recurrenceType || "none").toLowerCase());
    setEstimatedMinutes(Number(initialTodo?.estimatedMinutes) || 25);
    setSubtasksText(
      subtasks
        .map((subtask) => subtask?.title || "")
        .filter(Boolean)
        .join("\n")
    );
    setAttachmentLabel(firstAttachment?.label || "");
    setAttachmentUrl(firstAttachment?.url || "");
    setOwnerId(initialTodo?.ownerId || "owner-1");
    setAssigneeId(initialTodo?.assigneeId || "");
    setLocationText(
      hasLocation
        ? `${locationReminder.latitude}, ${locationReminder.longitude}, ${locationReminder.radius || 250}`
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
    const trimmedTitle = title.trim();
    if (!trimmedTitle || typeof onSubmit !== "function") {
      return;
    }

    const initialSubtasks = ensureArray(initialTodo?.subtasks);
    const trimmedAttachmentLabel = attachmentLabel.trim();
    const trimmedAttachmentUrl = attachmentUrl.trim();
    const normalizedOwnerId = ownerId.trim() || "owner-1";
    const normalizedAssigneeId = assigneeId.trim();
    const [latitude, longitude, radius] = locationText
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));

    onSubmit({
      title: trimmedTitle,
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
          completed: initialSubtasks[index]?.completed || false,
          sortOrder: index
        })),
      attachments: trimmedAttachmentLabel
        ? [
            {
              type: trimmedAttachmentUrl ? "link" : "note",
              label: trimmedAttachmentLabel,
              url: trimmedAttachmentUrl,
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
        ownerId: normalizedOwnerId,
        assigneeId: normalizedAssigneeId || null,
        sharedWith: normalizedAssigneeId ? [{userId: normalizedAssigneeId, role: "editor"}] : []
      }
    });
  };

  const submitLabel = isSaving
    ? t("common.saving")
    : t(initialTodo ? "todo.actions.save" : "todo.actions.add");

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
        <Button
          icon={<Sparkles size={18} />}
          variant="secondary"
          onClick={applySmartInput}
          disabled={!smartInput.trim()}
        >
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

      <Textarea
        id="todo-description"
        label={t("todo.fields.description")}
        placeholder={t("todo.fields.descriptionPlaceholder")}
        value={description}
        maxLength={1000}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="form-grid">
        <Select
          id="todo-priority"
          label={t("advanced.priority")}
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">{t("advanced.priorityLow")}</option>
          <option value="medium">{t("advanced.priorityMedium")}</option>
          <option value="high">{t("advanced.priorityHigh")}</option>
          <option value="urgent">{t("advanced.priorityUrgent")}</option>
        </Select>

        <Select
          id="todo-status"
          label={t("advanced.status")}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="backlog">{t("advanced.backlog")}</option>
          <option value="todo">{t("advanced.todo")}</option>
          <option value="in_progress">{t("advanced.inProgress")}</option>
          <option value="done">{t("advanced.done")}</option>
        </Select>

        <Input
          id="todo-category"
          label={t("advanced.category")}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <Input
          id="todo-estimate"
          label={t("advanced.estimate")}
          type="number"
          min="1"
          value={estimatedMinutes}
          onChange={(event) => setEstimatedMinutes(event.target.value)}
        />

        <Input
          id="todo-due"
          label={t("advanced.dueDate")}
          type="datetime-local"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        <Input
          id="todo-reminder"
          label={t("advanced.reminder")}
          type="datetime-local"
          value={reminderAt}
          onChange={(event) => setReminderAt(event.target.value)}
        />

        <Select
          id="todo-repeat"
          label={t("advanced.repeat")}
          value={recurrenceType}
          onChange={(event) => setRecurrenceType(event.target.value)}
        >
          <option value="none">{t("advanced.repeatNone")}</option>
          <option value="daily">{t("advanced.repeatDaily")}</option>
          <option value="weekly">{t("advanced.repeatWeekly")}</option>
          <option value="monthly">{t("advanced.repeatMonthly")}</option>
          <option value="custom">{t("advanced.repeatCustom")}</option>
        </Select>

        <label className="field field--checkbox" htmlFor="todo-important">
          <input
            id="todo-important"
            type="checkbox"
            checked={important}
            onChange={(event) => setImportant(event.target.checked)}
          />
          <span>{t("advanced.important")}</span>
        </label>
      </div>

      <Textarea
        id="todo-subtasks"
        label={t("advanced.subtasks")}
        placeholder={t("advanced.subtasksPlaceholder")}
        value={subtasksText}
        onChange={(event) => setSubtasksText(event.target.value)}
      />

      <div className="form-grid">
        <Input
          id="attachment-label"
          label={t("advanced.attachment")}
          value={attachmentLabel}
          onChange={(event) => setAttachmentLabel(event.target.value)}
        />
        <Input
          id="attachment-url"
          label={t("advanced.attachmentUrl")}
          value={attachmentUrl}
          onChange={(event) => setAttachmentUrl(event.target.value)}
        />
        <Input
          id="owner-id"
          label={t("advanced.owner")}
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
        />
        <Input
          id="assignee-id"
          label={t("advanced.assignee")}
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
        />
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
        <Button icon={<Save size={18} />} disabled={!title.trim() || isSaving} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default TodoForm;
