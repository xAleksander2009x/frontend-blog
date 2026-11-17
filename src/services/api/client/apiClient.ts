import axios from "axios";

export const DEFAULT_API_BASE_URL = "http://localhost:3000";
export const API_TIMEOUT_MS = 10_000;

export const getApiBaseUrl = (
  envUrl: string | undefined = import.meta.env.VITE_API_URL,
): string => {
  const trimmed = envUrl?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_API_BASE_URL;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});
