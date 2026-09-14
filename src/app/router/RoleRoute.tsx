import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, useMe, type UserRole } from "@/entities/user";
import { ROUTES } from "@/shared";

interface RoleRouteProps {
  /** Роли, которым открыт вложенный роут. Пустой список — никому. */
  roles: UserRole["type"][];
}

/**
 * Ролевой guard для вложенных роутов. ProtectedRoute проверяет только
 * аутентификацию; сюда попадают роуты кураторской/модераторской зоны —
 * их открывает само владение ролью, а не выбранный режим в свитчере
 * (preferredRoleType — косметика).
 *
 * Пока me() грузится — просто ничего не рендерим, как остальные страницы
 * с данными. useMe с retry:false при 401/403 даёт data === undefined при
 * isLoading === false — редиректить в этот момент нельзя: после login
 * queryClient.clear() и кэш пуст, и «не успевший» me выкидывал бы
 * пользователя с его же рабочей страницы.
 */
export const RoleRoute = ({ roles }: RoleRouteProps) => {
  const authStatus = useAuthStore((state) => state.status);
  const { data: me, isLoading } = useMe();

  // Сессия проверяется (bootstrap) или профиль едет — не решаем ничего.
  if (authStatus === "idle" || authStatus === "loading" || isLoading) {
    return null;
  }

  // Не аутентифицирован — на публичную часть, как ProtectedRoute.
  if (authStatus !== "authenticated" || !me) {
    return <Navigate to={ROUTES.PROJECTS.BASE} replace />;
  }

  const hasAccess = me.roles.some((role) => roles.includes(role.type));

  if (!hasAccess) {
    return <Navigate to={ROUTES.MAIN} replace />;
  }

  return <Outlet />;
};
