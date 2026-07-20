const priorityWords = {
  urgent: "urgent",
  asap: "urgent",
  high: "high",
  medium: "medium",
  normal: "medium",
  low: "low"
};

const nextWeekdayPattern = String.raw`\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b`;
const timePattern = String.raw`\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b`;
const pad = (value) => String(value).padStart(2, "0");
const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

const toLocalInputValue = (date) => {
  if (!isValidDate(date)) {
    return "";
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
};

const parseTime = (text, date) => {
  const timeMatch = new RegExp(timePattern, "i").exec(text);
  if (!timeMatch) {
    return date;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] || 0);
  const meridiem = timeMatch[3].toLowerCase();

  if (meridiem === "pm" && hours < 12) {
    hours += 12;
  }
  if (meridiem === "am" && hours === 12) {
    hours = 0;
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
};

export function parseSmartTask(input) {
  const raw = String(input ?? "").trim();
  const lower = raw.toLowerCase();
  const now = new Date();
  let dueDate = null;
  let recurrenceType = "none";
  let important = /\bimportant\b/i.test(raw);
  let priority = "medium";
  let title = raw;

  Object.entries(priorityWords).forEach(([word, value]) => {
    const wordPattern = String.raw`\b${word}\b`;
    if (new RegExp(wordPattern, "i").test(raw)) {
      priority = value;
      title = title.replace(
        new RegExp(String.raw`\b${word}\s+priority\b|${wordPattern}`, "gi"),
        ""
      );
    }
  });

  if (lower.includes("tomorrow")) {
    dueDate = new Date(now);
    dueDate.setDate(now.getDate() + 1);
    dueDate.setHours(18, 0, 0, 0);
    title = title.replace(/\btomorrow\b/gi, "");
  } else if (lower.includes("today")) {
    dueDate = new Date(now);
    dueDate.setHours(18, 0, 0, 0);
    title = title.replace(/\btoday\b/gi, "");
  } else {
    const nextMatch = new RegExp(nextWeekdayPattern).exec(lower);
    if (nextMatch) {
      const dayIndex = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ].indexOf(nextMatch[1]);
      dueDate = new Date(now);
      const distance = (dayIndex + 7 - now.getDay()) % 7 || 7;
      dueDate.setDate(now.getDate() + distance);
      dueDate.setHours(18, 0, 0, 0);
      title = title.replace(new RegExp(nextWeekdayPattern, "gi"), "");
    }
  }

  if (dueDate) {
    dueDate = parseTime(raw, dueDate);
    title = title.replace(new RegExp(timePattern, "gi"), "");
  }

  if (/\bdaily\b/i.test(raw)) {
    recurrenceType = "daily";
    title = title.replace(/\bdaily\b/gi, "");
  } else if (/\bweekly\b/i.test(raw)) {
    recurrenceType = "weekly";
    title = title.replace(/\bweekly\b/gi, "");
  } else if (/\bmonthly\b/i.test(raw)) {
    recurrenceType = "monthly";
    title = title.replace(/\bmonthly\b/gi, "");
  }

  if (important) {
    title = title.replace(/\bimportant\b/gi, "");
  }

  title = title.replace(/\s+/g, " ").trim();

  return {
    title: title || raw,
    priority,
    important,
    recurrenceType,
    dueDate: toLocalInputValue(dueDate),
    reminderAt: dueDate ? toLocalInputValue(new Date(dueDate.getTime() - 30 * 60 * 1000)) : ""
  };
}

export function toDateInputValue(value) {
  const date = value ? new Date(value) : null;
  return isValidDate(date) ? toLocalInputValue(date) : "";
}

export function fromDateInputValue(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return isValidDate(date) ? date.toISOString() : null;
}
