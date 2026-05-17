import {createSlice} from "@reduxjs/toolkit";

const readStorage = (key) => {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures and keep the in-memory state.
  }
};

const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage write failures and keep the in-memory state.
  }
};

const initialState = {
  provider: readStorage("mindx-auth-provider"),
  accessToken: readStorage("mindx-google-token"),
  status: "idle"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setGoogleSession(state, action) {
      const accessToken = action.payload?.accessToken ?? "";
      state.provider = accessToken ? "google" : "";
      state.accessToken = accessToken;
      state.status = accessToken ? "authenticated" : "idle";
      if (accessToken) {
        writeStorage("mindx-auth-provider", "google");
        writeStorage("mindx-google-token", accessToken);
      } else {
        removeStorage("mindx-auth-provider");
        removeStorage("mindx-google-token");
      }
    },
    logout(state) {
      state.provider = "";
      state.accessToken = "";
      state.status = "idle";
      removeStorage("mindx-auth-provider");
      removeStorage("mindx-google-token");
    }
  }
});

export const {logout, setGoogleSession} = authSlice.actions;
export const selectAuth = (state) => ({
  provider: state?.auth?.provider ?? "",
  accessToken: state?.auth?.accessToken ?? "",
  status: state?.auth?.status ?? "idle"
});
export default authSlice.reducer;
