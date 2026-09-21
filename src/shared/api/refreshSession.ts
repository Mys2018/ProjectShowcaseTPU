import axios from "axios";
import { ENDPOINTS } from "../config/endpoints";

const REFRESH_TIMEOUT_MS = 15_000;

let lastRefreshSuccessAt = 0;
let inFlight: Promise<void> | null = null;

/**
 * Рефреш сессии одним местом: его зовут и интерцептор (реактивно, на 401/403),
 * и проактивный планировщик. Сырой axios без интерцепторов — иначе цикл.
 * Параллельные вызовы схлопываются в один запрос.
 */
export function refreshSession(): Promise<void> {
  if (inFlight) {
    return inFlight;
  }

  const refreshUrl = `${import.meta.env.VITE_API_BASE_URL || ""}${ENDPOINTS.REFRESH}`;

  inFlight = axios
    .post(refreshUrl, undefined, { withCredentials: true, timeout: REFRESH_TIMEOUT_MS })
    .then(() => {
      lastRefreshSuccessAt = Date.now();
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function recordAuthSuccess(): void {
  lastRefreshSuccessAt = Date.now();
}

export function getLastRefreshSuccessAt(): number {
  return lastRefreshSuccessAt;
}

/**
 * Окончательная ошибка рефреша: 403 (INVALID_COOKIE) или 422 (SESSION_NOT_FOUND)
 * по api.yaml — сессия мертва, нужен полный ре-логин. Сетевые ошибки и 5xx сюда
 * не попадают, чтобы офлайн/сбой бэкенда не выкидывали пользователя.
 */
export function isTerminalRefreshFailure(error: unknown): boolean {
  const status = (error as { response?: { status?: number } } | undefined)?.response?.status;
  return status === 403 || status === 422;
}
