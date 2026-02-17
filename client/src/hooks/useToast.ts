import { toast as sonnerToast } from "sonner";
import { TOAST_CONFIG } from "@/config/baseConfig";

type ToastKey = keyof typeof TOAST_CONFIG.MESSAGES;

export const useToast = () => ({
  success: (message: string)  => sonnerToast.success(message, { duration: TOAST_CONFIG.DURATION_MS }),
  error:   (message: string)  => sonnerToast.error(message,   { duration: TOAST_CONFIG.DURATION_MS }),
  info:    (message: string)  => sonnerToast.info(message,    { duration: TOAST_CONFIG.DURATION_MS }),
  warning: (message: string)  => sonnerToast.warning(message, { duration: TOAST_CONFIG.DURATION_MS }),
  preset:  (key: ToastKey)    => {
    const msg = TOAST_CONFIG.MESSAGES[key];
    const isErr = key.endsWith("ERROR") || key === "UNAUTHORIZED" || key === "FORBIDDEN";
    return isErr ? sonnerToast.error(msg) : sonnerToast.success(msg);
  },
});
