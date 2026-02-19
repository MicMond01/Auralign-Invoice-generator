import { baseApi } from "./baseApi";

// ── Types ─────────────────────────────────────────────────────────
export interface AccountDetail {
    _id?: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    isPrimary?: boolean;
}

export interface Company {
    _id: string;
    userId: string;
    name: string;
    logo?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accountDetails: AccountDetail[];
    signature?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCompanyPayload {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accountDetails: AccountDetail[];
}

export interface CompanyListResponse {
    success: boolean;
    message: string;
    data: {
        companies: Company[];
        total: number;
        page: number;
        pages: number;
    };
    meta?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface CompanyResponse {
    success: boolean;
    message: string;
    data: {
        company: Company;
    };
}

// ── API ───────────────────────────────────────────────────────────
export const companiesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /companies
        getCompanies: builder.query<
            CompanyListResponse,
            { page?: number; limit?: number } | void
        >({
            query: (params) => ({ url: "/companies", params: params ?? {} }),
            providesTags: (result) =>
                result?.data?.companies
                    ? [
                        ...result.data.companies.map((c) => ({
                            type: "Company" as const,
                            id: c._id,
                        })),
                        { type: "Company", id: "LIST" },
                    ]
                    : [{ type: "Company", id: "LIST" }],
        }),

        // GET /companies/:id
        getCompanyById: builder.query<CompanyResponse, string>({
            query: (id) => `/companies/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Company", id }],
        }),

        // POST /companies
        createCompany: builder.mutation<CompanyResponse, CreateCompanyPayload>({
            query: (body) => ({ url: "/companies", method: "POST", body }),
            invalidatesTags: [{ type: "Company", id: "LIST" }],
        }),

        // PUT /companies/:id
        updateCompany: builder.mutation<
            CompanyResponse,
            { id: string; data: Partial<CreateCompanyPayload> }
        >({
            query: ({ id, data }) => ({
                url: `/companies/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Company", id },
                { type: "Company", id: "LIST" },
            ],
        }),

        // DELETE /companies/:id
        deleteCompany: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/companies/${id}`, method: "DELETE" }),
            invalidatesTags: (_result, _err, id) => [
                { type: "Company", id },
                { type: "Company", id: "LIST" },
            ],
        }),

        // POST /companies/:id/logo  (multipart/form-data)
        uploadCompanyLogo: builder.mutation<
            CompanyResponse,
            { id: string; file: File }
        >({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append("logo", file);
                return {
                    url: `/companies/${id}/logo`,
                    method: "POST",
                    body: formData,
                    // Let the browser set multipart boundary automatically
                    prepareHeaders: (headers: Headers) => {
                        headers.delete("Content-Type");
                        return headers;
                    },
                };
            },
            invalidatesTags: (_result, _err, { id }) => [{ type: "Company", id }],
        }),

        // POST /companies/:id/signature  (multipart/form-data)
        uploadCompanySignature: builder.mutation<
            CompanyResponse,
            { id: string; file: File }
        >({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append("signature", file);
                return {
                    url: `/companies/${id}/signature`,
                    method: "POST",
                    body: formData,
                    prepareHeaders: (headers: Headers) => {
                        headers.delete("Content-Type");
                        return headers;
                    },
                };
            },
            invalidatesTags: (_result, _err, { id }) => [{ type: "Company", id }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCompaniesQuery,
    useGetCompanyByIdQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useUploadCompanyLogoMutation,
    useUploadCompanySignatureMutation,
} = companiesApi;
