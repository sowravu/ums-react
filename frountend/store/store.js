
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

console.log("authReducer is",authReducer)

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
