
import api from "./axios";

export const loginApi = (credentials) => api.post("/login", credentials);
export const signupApi = (data) => api.post("/signup", data);
export const refreshApi = () => api.post("/refresh");
export const profileApi = () => api.get("/profile");
export const getHomeData = () => api.get("/home");
export const getdashboarddata = () => api.get("/dashboard");
export const editUser = (id, formData) =>
  api.put(`/dashboard/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const toggleBlock = (id) => api.patch(`/dashboard/${id}/block`);