import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AppNotification {
  id:        string;
  title:     string;
  message:   string;
  type:      "info" | "success" | "warning" | "error";
  read:      boolean;
  createdAt: string;
  link?:     string;
}

interface NotificationsState {
  items:       AppNotification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items:       [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<AppNotification, "read">>) => {
      state.items.unshift({ ...action.payload, read: false });
      state.unreadCount++;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.items.find((i) => i.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((i) => (i.read = true));
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload);
      if (idx !== -1) {
        if (!state.items[idx].read) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items.splice(idx, 1);
      }
    },
    clearAll: (state) => {
      state.items       = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearAll } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
