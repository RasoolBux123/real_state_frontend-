import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "./config";

export const http = axios.create({ baseURL: API_URL });

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired / invalid token => log out (but never for the login/register calls themselves)
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url ?? "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthCall && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);
