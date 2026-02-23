import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";

/**
 * Convenience hook that derives common auth values from Redux.
 * Any component can call `useAuthStore()` instead of repeating
 * the same selector + derived-logic boilerplate.
 */
export const useAuthStore = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAdmin = user?.role === "admin";

  const userCompanyId =
    typeof user?.companyId === "string"
      ? user.companyId
      : (user?.companyId as any)?._id;

  return { user, isAdmin, userCompanyId } as const;
};
