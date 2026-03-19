import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { useAuthStore } from "../state/authStore";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

