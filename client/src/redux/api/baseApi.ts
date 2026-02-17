import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { API_CONFIG, AUTH_CONFIG, TOAST_CONFIG } from "@/config/baseConfig";
import { logout, setTokens } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.FULL_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to refresh
    const refreshToken = (api.getState() as RootState).auth.tokens?.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url:    "/auth/refresh",
          method: "POST",
          body:   { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        api.dispatch(setTokens(refreshResult.data as any));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        toast.error(TOAST_CONFIG.MESSAGES.UNAUTHORIZED);
      }
    } else {
      api.dispatch(logout());
      toast.error(TOAST_CONFIG.MESSAGES.UNAUTHORIZED);
    }
  }

  if (result.error?.status === 403) {
    toast.error(TOAST_CONFIG.MESSAGES.FORBIDDEN);
  }

  if (result.error && typeof result.error.status === "number" && result.error.status >= 500) {
    toast.error(TOAST_CONFIG.MESSAGES.NETWORK_ERROR);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery:   baseQueryWithReauth,
  tagTypes:    ["Auth", "User", "Dashboard", "Report", "Settings"],
  endpoints:   () => ({}),
});
