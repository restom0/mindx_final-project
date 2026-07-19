import {createSlice} from "@reduxjs/toolkit";

const defaultHabits = [
  {id: "habit-focus", title: "Deep work", checkIns: [], cadence: "daily"},
  {id: "habit-review", title: "Daily review", checkIns: [], cadence: "daily"}
];

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const readJson = (key, fallback) => {
  try {
    const raw = readStorage(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures and keep the in-memory state.
  }
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);
const readNumber = (key, fallback) => {
  const rawValue = readStorage(key);
  if (rawValue === null) {
    return fallback;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : fallback;
};
const normalizeHabits = (value) => {
  const habits = ensureArray(value)
    .map((habit, index) => ({
      id: habit?.id || `habit-${index + 1}`,
      title: habit?.title || "",
      cadence: habit?.cadence || "daily",
      checkIns: ensureArray(habit?.checkIns)
        .filter((checkIn) => typeof checkIn?.date === "string")
        .map((checkIn) => ({
          date: checkIn.date,
          completed: Boolean(checkIn.completed)
        }))
    }))
    .filter((habit) => habit.title);

  return habits.length ? habits : defaultHabits;
};
const normalizeSessions = (value) =>
  ensureArray(value).map((session, index) => ({
    id: session?.id || `focus-${index + 1}`,
    todoId: session?.todoId ?? null,
    mode: session?.mode || "focus",
    durationMinutes: Number(session?.durationMinutes) || 0,
    completedTask: Boolean(session?.completedTask),
    startedAt: session?.startedAt || null,
    completedAt: session?.completedAt || null
  }));
const normalizeBadges = (value) =>
  ensureArray(value)
    .filter((badge) => typeof badge === "string")
    .map((badge) => badge.trim())
    .filter(Boolean);

const congratulations = [
  "Nice finish. That one counts.",
  "Momentum banked.",
  "Clean work. Keep the loop short.",
  "Another small win stacked."
];
const getCongratulations = (index) => congratulations[index % congratulations.length];

const initialState = {
  habits: normalizeHabits(readJson("mindx-habits", defaultHabits)),
  focusSessions: normalizeSessions(readJson("mindx-focus-sessions", [])),
  badges: normalizeBadges(readJson("mindx-badges", [])),
  level: readNumber("mindx-level", 1),
  score: readNumber("mindx-score", 0),
  lastCongratulation: ""
};

const syncProgress = (state) => {
  save("mindx-habits", state.habits);
  save("mindx-focus-sessions", state.focusSessions);
  save("mindx-badges", state.badges);
  try {
    localStorage.setItem("mindx-level", String(state.level));
    localStorage.setItem("mindx-score", String(state.score));
  } catch {
    // Ignore storage write failures and keep the in-memory state.
  }
};

const productivitySlice = createSlice({
  name: "productivity",
  initialState,
  reducers: {
    addHabit(state, action) {
      const title = action.payload?.title?.trim();
      if (!title) {
        return;
      }

      state.habits.push({
        id: `habit-${Date.now()}`,
        title,
        cadence: "daily",
        checkIns: []
      });
      syncProgress(state);
    },
    checkInHabit(state, action) {
      const habit = state.habits.find((item) => item.id === action.payload);
      const today = new Date().toISOString().slice(0, 10);
      const checkIns = ensureArray(habit?.checkIns);
      if (habit) {
        habit.checkIns = checkIns;
      }

      if (habit && !checkIns.some((checkIn) => checkIn?.date === today)) {
        habit.checkIns.push({date: today, completed: true});
        state.score += 10;
        state.lastCongratulation = getCongratulations(checkIns.length + state.score);
      }
      syncProgress(state);
    },
    recordFocusSession(state, action) {
      const payload = action.payload && typeof action.payload === "object" ? action.payload : {};
      const durationMinutes = Number(payload.durationMinutes);
      const safeDurationMinutes =
        Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 0;

      state.focusSessions.unshift({
        id: `focus-${Date.now()}`,
        ...payload,
        durationMinutes: safeDurationMinutes,
        completedTask: Boolean(payload.completedTask)
      });
      state.score += safeDurationMinutes;
      if (state.score >= state.level * 120) {
        state.level += 1;
        if (!state.badges.includes("Level up")) {
          state.badges.push("Level up");
        }
      }
      if (payload.completedTask && !state.badges.includes("Closer")) {
        state.badges.push("Closer");
      }
      state.lastCongratulation = getCongratulations(state.focusSessions.length + state.score);
      syncProgress(state);
    },
    awardCompletion(state) {
      state.score += 15;
      if (!state.badges.includes("Task finisher")) {
        state.badges.push("Task finisher");
      }
      state.lastCongratulation = getCongratulations(state.badges.length + state.score);
      syncProgress(state);
    }
  }
});

export const {addHabit, awardCompletion, checkInHabit, recordFocusSession} =
  productivitySlice.actions;
export const selectProductivity = (state) => ({
  habits: ensureArray(state?.productivity?.habits),
  focusSessions: ensureArray(state?.productivity?.focusSessions),
  badges: ensureArray(state?.productivity?.badges),
  level: Number.isFinite(state?.productivity?.level) ? state.productivity.level : 1,
  score: Number.isFinite(state?.productivity?.score) ? state.productivity.score : 0,
  lastCongratulation: state?.productivity?.lastCongratulation ?? ""
});
export default productivitySlice.reducer;
