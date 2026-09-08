import type { InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { ENDPOINTS } from "../config/endpoints";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export interface FailedRequest {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

interface ErrorResponseData {
  code?: string;
  msg?: string;
}

const isAuthFailure = (error: AxiosError): boolean => {
  const status = error.response?.status;
  if (status === 401) {
    return true;
  }
  if (status === 403) {
    const data = error.response?.data as ErrorResponseData | undefined;
    return !data?.code || data.code === "AUTHORIZATION_FAILED";
  }
  return false;
};

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.includes(ENDPOINTS.REFRESH) ||
    url.includes(ENDPOINTS.LOGIN) ||
    url.includes(ENDPOINTS.LOGOUT)
  );
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isAuthFailure(error)) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._retry = true;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = `${axiosInstance.defaults.baseURL || import.meta.env.VITE_API_BASE_URL || ""}${ENDPOINTS.REFRESH}`;
        await axios.post(
          refreshUrl,
          {},
          { withCredentials: true },
        );

        window.dispatchEvent(new CustomEvent("auth:refreshed"));
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

