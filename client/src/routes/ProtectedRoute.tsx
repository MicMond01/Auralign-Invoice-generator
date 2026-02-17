import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/redux/selectors/authSelectors";
import { ROUTES } from "@/config/baseConfig";
import type { Role } from "@/config/baseConfig";
import { ROLE_HIERARCHY } from "@/config/baseConfig";

interface ProtectedRouteProps {
  requiredRole?: Role;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole        = useAppSelector((s) => s.auth.user?.role);
  const location        = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && userRole) {
    const hasAccess = ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
    if (!hasAccess) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
