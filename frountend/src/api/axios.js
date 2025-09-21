
import axios from "axios";
import store from "../../store/store";
import { logout, setToken } from "../../store/slices/authSlice";


const api = axios.create({
  baseURL: "https://ums-react-backend-j5vg.onrender.com",
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    const token =store.getState().auth.token;
  
    if (token ) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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

        return api(originalRequest); 
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
