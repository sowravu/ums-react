import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const siginup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/signup", formData, {
        withCredentials: true,
      });
      console.log("form data is", formData);
      console.log(" res.data is is ", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "signup faild");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/login", formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "login faild");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(siginup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(siginup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(siginup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;
