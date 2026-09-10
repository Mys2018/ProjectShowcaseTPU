import { useEffect } from "react";
import { useAuthStore } from "@/entities/user";
import {
  getLastRefreshSuccessAt,
  refreshSession,
} from "@/shared";

const DEFAULT_REFRESH_INTERVAL_MS = 5 * 1000;

const getRefreshInterval = (): number => {
  const raw = Number(import.meta.env.VITE_AUTH_REFRESH_INTERVAL_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_REFRESH_INTERVAL_MS;
};

/**
 * Проактивный рефреш сессии. В простаивающей вкладке все данные закэшированы
 * (staleTime: Infinity), поэтому реактивный интерцептор никогда не сработает,
 * а серверная сессия тихо истекает — и к возвращению пользователя refresh-токен
 * уже мёртв. Здесь мы сами периодически продлеваем сессию.
 *
 * Работает только пока пользователь аутентифицирован; сетевые/временные ошибки
 * рефреша молча проглатываются, на окончательную смерть сессии (403/422) кидаем
 * auth:unauthorized, чтобы bootstrap увёл на логин.
 */
export const useProactiveTokenRefresh = () => {
  const status = useAuthStore((state) => state.status);
  const isLoggedOut = useAuthStore((state) => state.isLoggedOut);
  const isActive = status === "authenticated" && !isLoggedOut;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const interval = getRefreshInterval();

    const runRefresh = () => {
      refreshSession()
        .then(() => {
          window.dispatchEvent(new CustomEvent("auth:refreshed"));
        })
        .catch((error) => {
          // Фоновый проактивный рефреш — оптимизация.
          // Не выкидываем пользователя, пока его access-токен ещё работает.
          console.warn("[Proactive Refresh] Failed to refresh token in background:", error);
        });
    };

    const timer = window.setInterval(runRefresh, interval);

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }
      const lastSuccess = getLastRefreshSuccessAt();
      if (lastSuccess > 0 && Date.now() - lastSuccess < interval) {
        return;
      }
      if (lastSuccess === 0) {
        return;
      }
      runRefresh();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive]);
};
