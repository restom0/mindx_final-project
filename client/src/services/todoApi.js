const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const buildHeaders = (language, extra = {}) => ({
  "Accept-Language": language,
  "Content-Type": "application/json",
  ...extra
});

const parseJson = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "Request failed");
  }

  return body;
};

export const todoApi = {
  async list(query, language) {
    const params = new URLSearchParams(query);
    const response = await fetch(`${API_BASE_URL}/todos?${params}`, {
      headers: buildHeaders(language)
    });
    return parseJson(response);
  },

  async create(payload, language) {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload)
    });
    return parseJson(response);
  },

  async update(id, payload, language) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "PATCH",
      headers: buildHeaders(language),
      body: JSON.stringify(payload)
    });
    return parseJson(response);
  },

  async remove(id, language) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
      headers: buildHeaders(language)
    });
    return parseJson(response);
  },

  async createFocusSession(payload, language) {
    const response = await fetch(`${API_BASE_URL}/todos/focus-sessions`, {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload)
    });
    return parseJson(response);
  },

  async listHabits(language) {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      headers: buildHeaders(language)
    });
    return parseJson(response);
  },

  async createHabit(payload, language) {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload)
    });
    return parseJson(response);
  },

  async checkInHabit(habitId, payload, language) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/check-ins`, {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload)
    });
    return parseJson(response);
  },

  async aiBreakdown(payload, language) {
    const response = await fetch(`${API_BASE_URL}/ai/task-breakdown`, {
      method: "POST",
      headers: buildHeaders(language),
      body: JSON.stringify(payload)
    });
    return parseJson(response);
  }
};
