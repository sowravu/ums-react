import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const siginup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://ums-react-backend-j5vg.onrender.com/signup", formData, {
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

// export const updateUserByAdmin=createAsyncThunk(
//   'auth/siginup',
//   async(formData,{rejectWithValue})=>{
//     try {
//       const res=await axios.post
//     } catch (error) {

//     }
//   }
// )

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://ums-react-backend-j5vg.onrender.com/login", formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "login faild");
    }
  }
);

export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://ums-react-backend-j5vg.onrender.com/editProfile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("edit profile data is ", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile update failed");
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
      console.log("state.token", action.payload);
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
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
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, setToken,setUser } = authSlice.actions;

export default authSlice.reducer;
