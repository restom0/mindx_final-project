import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  provider: localStorage.getItem("mindx-auth-provider") || "",
  accessToken: localStorage.getItem("mindx-google-token") || "",
  status: "idle"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setGoogleSession(state, action) {
      state.provider = "google";
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
      localStorage.setItem("mindx-auth-provider", "google");
      localStorage.setItem("mindx-google-token", action.payload.accessToken);
    },
    logout(state) {
      state.provider = "";
      state.accessToken = "";
      state.status = "idle";
      localStorage.removeItem("mindx-auth-provider");
      localStorage.removeItem("mindx-google-token");
    }
  }
});

export const {logout, setGoogleSession} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
