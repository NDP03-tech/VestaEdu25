import apiClient from "./apiClient";

export const login = (credentials) => apiClient.post("/api/login", credentials);
export const getCurrentUser = () => apiClient.get("/api/me");
export const logout = () => apiClient.post("/api/logout");
