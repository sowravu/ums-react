
import api from "./axios";

export const loginApi = (credentials) => api.post("/login", credentials);
export const signupApi = (data) => api.post("/signup", data);
export const refreshApi = () => api.post("/refresh");
export const profileApi = () => api.get("/profile");
export const getHomeData = () => api.get("/home");