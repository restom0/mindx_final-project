import {createSlice} from "@reduxjs/toolkit";

const getStoredValue = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const setStoredValue = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures and keep the in-memory state.
  }
};

const initialState = {
  theme: getStoredValue("mindx-theme", "light"),
  language: getStoredValue("mindx-language", "en")
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      setStoredValue("mindx-theme", state.theme);
    },
    setLanguage(state, action) {
      state.language = action.payload || "en";
      setStoredValue("mindx-language", state.language);
    }
  }
});

export const {setLanguage, toggleTheme} = settingsSlice.actions;
export const selectTheme = (state) => state?.settings?.theme ?? "light";
export const selectLanguage = (state) => state?.settings?.language ?? "en";
export default settingsSlice.reducer;
