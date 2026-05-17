import {SERVER_DOWN_PATH, notifyServerDown} from "../utils/serverDown.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const buildHeaders = (language, extra = {}) => ({
  "Accept-Language": language || "en",
  "Content-Type": "application/json",
  ...extra
});

const shouldRedirectToServerDown = () => globalThis.window?.location?.pathname !== SERVER_DOWN_PATH;

const redirectToServerDown = (details = {}) => {
  if (shouldRedirectToServerDown()) {
    notifyServerDown(details);
  }
};

const parseJson = async (response) => {
  const parsed = await response.json().catch(() => null);
  const body = parsed && typeof parsed === "object" ? parsed : {};

  if (!response.ok) {
    if (response.status >= 500) {
      redirectToServerDown({status: response.status, message: body.message || "Server unavailable"});
    }

    throw new Error(body.message || "Request failed");
  }

  return body;
};

const requestJson = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    return await parseJson(response);
  } catch (error) {
    if (error instanceof TypeError) {
      redirectToServerDown({message: error.message || "Network request failed"});
    }

    throw error;
  }
};

export const todoApi = {
  async list(query, language) {
    const params = new URLSearchParams(query ?? {});
    return requestJson(`/todos?${params}`, {
      headers: buildHeaders(language)
    });
  },

  async create(payload, language) {
    return requestJson("/todos", {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload ?? {})
    });
  },

  async update(id, payload, language) {
    return requestJson(`/todos/${encodeURIComponent(String(id ?? ""))}`, {
      method: "PATCH",
      headers: buildHeaders(language),
      body: JSON.stringify(payload ?? {})
    });
  },

  async remove(id, language) {
    return requestJson(`/todos/${encodeURIComponent(String(id ?? ""))}`, {
      method: "DELETE",
      headers: buildHeaders(language)
    });
  },

  async createFocusSession(payload, language) {
    return requestJson("/todos/focus-sessions", {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload ?? {})
    });
  },

  async listHabits(language) {
    return requestJson("/habits", {
      headers: buildHeaders(language)
    });
  },

  async createHabit(payload, language) {
    return requestJson("/habits", {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload ?? {})
    });
  },

  async checkInHabit(habitId, payload, language) {
    return requestJson(`/habits/${encodeURIComponent(String(habitId ?? ""))}/check-ins`, {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload ?? {})
    });
  },

  async aiBreakdown(payload, language) {
    return requestJson("/ai/task-breakdown", {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload ?? {})
    });
  }
};
