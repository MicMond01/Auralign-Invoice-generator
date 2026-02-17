import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "@/redux/api/baseApi";
import authReducer from "@/redux/slices/authSlice";
import uiReducer from "@/redux/slices/uiSlice";
import notificationsReducer from "@/redux/slices/notificationsSlice";
import { AUTH_CONFIG } from "@/config/baseConfig";

// ── Persist config for auth ────────────────────────────────────
const authPersistConfig = {
  key:       AUTH_CONFIG.PERSIST_KEY,
  storage,
  whitelist: ["user", "tokens", "isAuthenticated"],
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth:           persistReducer(authPersistConfig, authReducer),
  ui:             uiReducer,
  notifications:  notificationsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type RootState   = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
