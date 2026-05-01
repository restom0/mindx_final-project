import {createSlice} from "@reduxjs/toolkit";

const getStoredValue = (key, fallback) => localStorage.getItem(key) || fallback;

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
      localStorage.setItem("mindx-theme", state.theme);
    },
    setLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem("mindx-language", action.payload);
    }
  }
});

export const {setLanguage, toggleTheme} = settingsSlice.actions;
export const selectTheme = (state) => state.settings.theme;
export const selectLanguage = (state) => state.settings.language;
export default settingsSlice.reducer;
