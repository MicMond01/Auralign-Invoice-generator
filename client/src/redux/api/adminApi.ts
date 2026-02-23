import { ICompanies, ICompanyResponse } from "@/types/api/companies";
import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";

export interface CreateCompanyUserPayload {
  companyName: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  accountDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    isPrimary?: boolean;
  }[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanies: build.query<ApiResponse<ICompanies>, void>({
      query: () => ({
        url: "/admin/companies",
      }),
      providesTags: ["Admin", "Company"],
    }),
    getCompanyById: build.query<ApiResponse<ICompanyResponse>, string>({
      query: (id) => ({
        url: `/admin/companies/${id}`,
      }),
      providesTags: ["Admin", "Company"],
    }),
    createCompanyWithUser: build.mutation<
      ApiResponse<any>,
      CreateCompanyUserPayload
    >({
      query: (body) => ({
        url: "/admin/create-company-user",
        method: "POST",
        body,
        responseHandler: (response) => {
          // Check if response is PDF blob or JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/pdf")) {
            return response.blob();
          }
          return response.json();
        },
      }),
      invalidatesTags: ["Admin", "User", "Company"],
    }),
    getUsers: build.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/admin/users",
      }),
      providesTags: ["Admin", "User"],
    }),
    deactivateUser: build.mutation<ApiResponse<any>, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["Admin", "User"],
    }),
    activateUser: build.mutation<ApiResponse<any>, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["Admin", "User"],
    }),
    resetUserPassword: build.mutation<ApiResponse<any>, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}/reset-password`,
        method: "POST",
      }),
    }),
    deleteUser: build.mutation<ApiResponse<any>, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin", "User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyWithUserMutation,
  useGetUsersQuery,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useResetUserPasswordMutation,
  useDeleteUserMutation,
} = adminApi;
