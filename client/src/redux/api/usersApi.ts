import { baseApi } from "./baseApi";
import type { User } from "@/types/auth";
import type { ApiResponse, PaginationParams } from "@/types/common";

interface UpdateUserRequest extends Partial<
  Pick<User, "firstName" | "lastName" | "avatarUrl">
> {
  id: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<ApiResponse<User[]>, PaginationParams>({
      query: (params) => ({
        url: "/users",
        params: params as Record<string, string | number | boolean | undefined>,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              "User",
            ]
          : ["User"],
    }),
    getUserById: build.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _err, id) => [{ type: "User", id }],
    }),
    updateUser: build.mutation<ApiResponse<User>, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "User", id }],
    }),
    deleteUser: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
