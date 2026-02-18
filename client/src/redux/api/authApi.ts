import { baseApi } from "./baseApi";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthTokens,
  User,
} from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      ApiResponse<{ user: User; tokens: AuthTokens }>,
      LoginRequest
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Auth"],
    }),
    register: build.mutation<ApiResponse<{ user: User }>, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    logout: build.mutation<ApiResponse<null>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: build.mutation<ApiResponse<null>, ForgotPasswordRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: build.mutation<ApiResponse<null>, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    getMe: build.query<ApiResponse<User>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    refreshToken: build.mutation<
      ApiResponse<AuthTokens>,
      { refreshToken: string }
    >({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
} = authApi;
