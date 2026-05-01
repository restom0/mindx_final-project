import {createSlice} from "@reduxjs/toolkit";

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const congratulations = [
  "Nice finish. That one counts.",
  "Momentum banked.",
  "Clean work. Keep the loop short.",
  "Another small win stacked."
];

const initialState = {
  habits: readJson("mindx-habits", [
    {id: "habit-focus", title: "Deep work", checkIns: [], cadence: "daily"},
    {id: "habit-review", title: "Daily review", checkIns: [], cadence: "daily"}
  ]),
  focusSessions: readJson("mindx-focus-sessions", []),
  badges: readJson("mindx-badges", []),
  level: Number(localStorage.getItem("mindx-level") || 1),
  score: Number(localStorage.getItem("mindx-score") || 0),
  lastCongratulation: ""
};

const syncProgress = (state) => {
  save("mindx-habits", state.habits);
  save("mindx-focus-sessions", state.focusSessions);
  save("mindx-badges", state.badges);
  localStorage.setItem("mindx-level", String(state.level));
  localStorage.setItem("mindx-score", String(state.score));
};

const productivitySlice = createSlice({
  name: "productivity",
  initialState,
  reducers: {
    addHabit(state, action) {
      state.habits.push({
        id: `habit-${Date.now()}`,
        title: action.payload.title,
        cadence: "daily",
        checkIns: []
      });
      syncProgress(state);
    },
    checkInHabit(state, action) {
      const habit = state.habits.find((item) => item.id === action.payload);
      const today = new Date().toISOString().slice(0, 10);
      if (habit && !habit.checkIns.some((checkIn) => checkIn.date === today)) {
        habit.checkIns.push({date: today, completed: true});
        state.score += 10;
        state.lastCongratulation = congratulations[Math.floor(Math.random() * congratulations.length)];
      }
      syncProgress(state);
    },
    recordFocusSession(state, action) {
      state.focusSessions.unshift({
        id: `focus-${Date.now()}`,
        ...action.payload
      });
      state.score += action.payload.durationMinutes;
      if (state.score >= state.level * 120) {
        state.level += 1;
        if (!state.badges.includes("Level up")) {
          state.badges.push("Level up");
        }
      }
      if (action.payload.completedTask && !state.badges.includes("Closer")) {
        state.badges.push("Closer");
      }
      state.lastCongratulation = congratulations[Math.floor(Math.random() * congratulations.length)];
      syncProgress(state);
    },
    awardCompletion(state) {
      state.score += 15;
      if (!state.badges.includes("Task finisher")) {
        state.badges.push("Task finisher");
      }
      state.lastCongratulation = congratulations[Math.floor(Math.random() * congratulations.length)];
      syncProgress(state);
    }
  }
});

export const {addHabit, awardCompletion, checkInHabit, recordFocusSession} = productivitySlice.actions;
export const selectProductivity = (state) => state.productivity;
export default productivitySlice.reducer;
