// src/api/axios.js
import axios from "axios";
import store from "../../store/store";
import { logout, setToken } from "../../store/slices/authSlice";


const api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
  withCredentials: true, // allow cookies if you store refresh token in httpOnly cookie
});

// Request Interceptor -> add token before every request
api.interceptors.request.use(
  (config) => {
    const token =store.getState().auth.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor -> handle expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {


    const originalRequest = error.config;

    // If token expired and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "http://localhost:5000/refresh",
          {},
          { withCredentials: true }
        );
          
        console.log("data.accessToken",data.accessToken)
       store.dispatch(setToken({ token: data.accessToken }));
   

        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest); // retry request
      } catch (err) {
        console.log("refresh token is missing")
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
