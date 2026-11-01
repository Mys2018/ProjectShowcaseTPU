import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared";

export const ProtectedRoute = () => {
  const authStatus = useAuthStore((state) => state.status);

  // 'idle' — сессия ещё не проверена: на первом рендере прямой ссылки нельзя
  // уводить вошедшего пользователя в каталог.
  if (authStatus === 'unauthenticated') {
    return <Navigate to={ROUTES.PROJECTS.BASE} replace />;
  }

  return <Outlet />;

};
