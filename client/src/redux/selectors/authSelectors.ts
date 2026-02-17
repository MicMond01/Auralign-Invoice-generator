import type { RootState } from "@/store";

export const selectCurrentUser        = (s: RootState) => s.auth.user;
export const selectIsAuthenticated    = (s: RootState) => s.auth.isAuthenticated;
export const selectAuthLoading        = (s: RootState) => s.auth.isLoading;
export const selectAuthError          = (s: RootState) => s.auth.error;
export const selectAccessToken        = (s: RootState) => s.auth.tokens?.accessToken;
export const selectUserRole           = (s: RootState) => s.auth.user?.role;
export const selectUserPermissions    = (s: RootState) => s.auth.user?.permissions ?? [];
export const selectUserDisplayName    = (s: RootState) =>
  s.auth.user ? `${s.auth.user.firstName} ${s.auth.user.lastName}` : "";
