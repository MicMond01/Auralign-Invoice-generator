import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { THEME_CONFIG } from "@/config/baseConfig";

interface UiState {
  sidebarOpen:      boolean;
  sidebarCollapsed: boolean;
  theme:            "light" | "dark" | "system";
  activeModal:      string | null;
  globalLoading:    boolean;
  breadcrumbs:      { label: string; path?: string }[];
}

const initialState: UiState = {
  sidebarOpen:      true,
  sidebarCollapsed: false,
  theme:            THEME_CONFIG.DEFAULT_THEME,
  activeModal:      null,
  globalLoading:    false,
  breadcrumbs:      [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar:       (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen:      (state, action: PayloadAction<boolean>) => { state.sidebarOpen = action.payload; },
    toggleSidebarCollapse: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setTheme:            (state, action: PayloadAction<"light" | "dark" | "system">) => { state.theme = action.payload; },
    openModal:           (state, action: PayloadAction<string>) => { state.activeModal = action.payload; },
    closeModal:          (state) => { state.activeModal = null; },
    setGlobalLoading:    (state, action: PayloadAction<boolean>) => { state.globalLoading = action.payload; },
    setBreadcrumbs:      (state, action: PayloadAction<{ label: string; path?: string }[]>) => { state.breadcrumbs = action.payload; },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setTheme,
  openModal,
  closeModal,
  setGlobalLoading,
  setBreadcrumbs,
} = uiSlice.actions;
export default uiSlice.reducer;
