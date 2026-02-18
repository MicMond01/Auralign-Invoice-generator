import { ICompanies } from "@/types/api/companies";
import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanies: build.query<ApiResponse<ICompanies>, void>({
      query: () => ({
        url: "/admin/companies",
      }),
      providesTags: ["Admin"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCompaniesQuery } = adminApi;
