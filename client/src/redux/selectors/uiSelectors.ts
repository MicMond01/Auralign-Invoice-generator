import type { RootState } from "@/store";

export const selectSidebarOpen        = (s: RootState) => s.ui.sidebarOpen;
export const selectSidebarCollapsed   = (s: RootState) => s.ui.sidebarCollapsed;
export const selectTheme              = (s: RootState) => s.ui.theme;
export const selectActiveModal        = (s: RootState) => s.ui.activeModal;
export const selectGlobalLoading      = (s: RootState) => s.ui.globalLoading;
export const selectBreadcrumbs        = (s: RootState) => s.ui.breadcrumbs;
