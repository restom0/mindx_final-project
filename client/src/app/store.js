import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import productivityReducer from "../features/productivity/productivitySlice.js";
import settingsReducer from "../features/settings/settingsSlice.js";
import todosReducer from "../features/todos/todosSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    productivity: productivityReducer,
    settings: settingsReducer,
    todos: todosReducer
  }
});
