import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { store, persistor } from "@/store";
import { TOAST_CONFIG } from "@/config/baseConfig";
import AppRouter from "@/routes/AppRouter";
import "@/styles/globals.css";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
        <Toaster
          position={TOAST_CONFIG.POSITION}
          toastOptions={{ duration: TOAST_CONFIG.DURATION_MS }}
          richColors
          closeButton
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);
