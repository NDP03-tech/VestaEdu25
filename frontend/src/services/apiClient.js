import axios from "axios";
import config from "../config";

const apiClient = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((request) => {
  if (request.headers) delete request.headers.Authorization;
  return request;
});

let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (
      error.response?.status !== 401 ||
      request?._retry ||
      request?.url?.includes("/api/refresh")
    ) {
      return Promise.reject(error);
    }
    request._retry = true;
    refreshPromise =
      refreshPromise ||
      apiClient.post("/api/refresh").finally(() => {
        refreshPromise = null;
      });
    await refreshPromise;
    return apiClient(request);
  },
);

export default apiClient;
