import { useAppSelector } from "@/store/hooks";
import { ROLE_HIERARCHY, type Role } from "@/config/baseConfig";

export const usePermission = () => {
  const user = useAppSelector((s) => s.auth.user);

  const hasRole = (required: Role): boolean => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[required];
  };

  const hasPermission = (permission: string): boolean =>
    user?.permissions.includes(permission) ?? false;

  return { hasRole, hasPermission, role: user?.role, permissions: user?.permissions ?? [] };
};
