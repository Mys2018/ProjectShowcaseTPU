import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared";

export const ProtectedRoute = () => {
  const authStatus = useAuthStore((state) => state.status);

  if (authStatus != 'loading' && authStatus != 'authenticated') {
    return <Navigate to={ROUTES.PROJECTS.BASE} replace />;
  }


  return <Outlet />;

};
