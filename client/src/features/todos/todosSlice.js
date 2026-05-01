import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {todoApi} from "../../services/todoApi.js";

const initialFilters = {
  filter: "all",
  search: "",
  sort: "createdAt",
  order: "desc"
};

const getLanguage = (state) => state.settings.language;

export const fetchTodos = createAsyncThunk("todos/fetch", async (_, {getState, rejectWithValue}) => {
  const state = getState();
  try {
    return await todoApi.list(
      {
        ...state.todos.filters,
        page: "1",
        limit: "100"
      },
      getLanguage(state)
    );
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createTodo = createAsyncThunk("todos/create", async (payload, {getState, rejectWithValue}) => {
  try {
    return await todoApi.create(payload, getLanguage(getState()));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateTodo = createAsyncThunk(
  "todos/update",
  async ({id, changes}, {getState, rejectWithValue}) => {
    try {
      return await todoApi.update(id, changes, getLanguage(getState()));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk("todos/delete", async (id, {getState, rejectWithValue}) => {
  try {
    const response = await todoApi.remove(id, getLanguage(getState()));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    meta: null,
    filters: initialFilters,
    status: "idle",
    saving: false,
    error: ""
  },
  reducers: {
    setFilter(state, action) {
      state.filters.filter = action.payload;
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    setSort(state, action) {
      state.filters.sort = action.payload.sort;
      state.filters.order = action.payload.order;
    },
    resetTodoError(state) {
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = state.items.length ? "refreshing" : "loading";
        state.error = "";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createTodo.pending, (state) => {
        state.saving = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload.data);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateTodo.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((todo) => todo.id === action.payload.data.id);
        if (index >= 0) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload.id);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {resetTodoError, setFilter, setSearch, setSort} = todosSlice.actions;
export const selectTodos = (state) => state.todos.items;
export const selectTodoFilters = (state) => state.todos.filters;
export const selectTodoStatus = (state) => state.todos.status;
export const selectTodoSaving = (state) => state.todos.saving;
export const selectTodoError = (state) => state.todos.error;
export const selectTodoMeta = (state) => state.todos.meta;
export default todosSlice.reducer;
