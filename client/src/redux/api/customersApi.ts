import { baseApi } from "./baseApi";

// ── Types ─────────────────────────────────────────────────────────
export interface Customer {
    _id: string;
    userId: string;
    companyId: string | { _id: string; name: string };
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    taxId?: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerPayload {
    companyId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    taxId?: string;
    notes?: string;
}

export interface CustomerListResponse {
    success: boolean;
    message: string;
    data: {
        customers: Customer[];
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

export interface CustomerResponse {
    success: boolean;
    message: string;
    data: {
        customer: Customer;
    };
}

export interface CustomerSearchResponse {
    success: boolean;
    message: string;
    data: {
        customers: Customer[];
    };
}

export interface CustomerListParams {
    page?: number;
    limit?: number;
    search?: string;
    companyId?: string;
}

// ── API ───────────────────────────────────────────────────────────
export const customersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /customers
        getCustomers: builder.query<CustomerListResponse, CustomerListParams>({
            query: (params) => ({ url: "/customers", params }),
            providesTags: (result) =>
                result?.data?.customers
                    ? [
                        ...result.data.customers.map((c) => ({
                            type: "Customer" as const,
                            id: c._id,
                        })),
                        { type: "Customer", id: "LIST" },
                    ]
                    : [{ type: "Customer", id: "LIST" }],
        }),

        // GET /customers/:id
        getCustomerById: builder.query<CustomerResponse, string>({
            query: (id) => `/customers/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Customer", id }],
        }),

        // GET /customers/company/:companyId
        getCustomersByCompany: builder.query<
            CustomerListResponse,
            { companyId: string; page?: number; limit?: number }
        >({
            query: ({ companyId, ...params }) => ({
                url: `/customers/company/${companyId}`,
                params,
            }),
            providesTags: [{ type: "Customer", id: "LIST" }],
        }),

        // GET /customers/search?q=...&companyId=...
        searchCustomers: builder.query<
            CustomerSearchResponse,
            { q: string; companyId?: string }
        >({
            query: (params) => ({ url: "/customers/search", params }),
        }),

        // POST /customers
        createCustomer: builder.mutation<CustomerResponse, CreateCustomerPayload>({
            query: (body) => ({ url: "/customers", method: "POST", body }),
            invalidatesTags: [{ type: "Customer", id: "LIST" }],
        }),

        // PUT /customers/:id
        updateCustomer: builder.mutation<
            CustomerResponse,
            { id: string; data: Partial<CreateCustomerPayload> }
        >({
            query: ({ id, data }) => ({
                url: `/customers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Customer", id },
                { type: "Customer", id: "LIST" },
            ],
        }),

        // DELETE /customers/:id
        deleteCustomer: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
            invalidatesTags: (_result, _err, id) => [
                { type: "Customer", id },
                { type: "Customer", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useGetCustomersByCompanyQuery,
    useSearchCustomersQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customersApi;
