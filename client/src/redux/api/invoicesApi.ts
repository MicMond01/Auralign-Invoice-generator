import { baseApi } from "./baseApi";

// ── Types ─────────────────────────────────────────────────────────
export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface AdditionalCharge {
    type:
    | "vat"
    | "tax"
    | "shipping"
    | "transportation"
    | "fuel"
    | "flight"
    | "discount"
    | "other";
    label: string;
    value: number;
    isPercentage?: boolean;
    amount: number;
}

export interface Invoice {
    _id: string;
    userId: string;
    companyId: string | Record<string, unknown>;
    customerId: string | Record<string, unknown>;
    invoiceNumber: string;
    invoiceType: "invoice" | "proforma";
    invoiceDate: string;
    dueDate?: string;
    status: "draft" | "sent" | "paid" | "cancelled" | "overdue";
    items: InvoiceItem[];
    subtotal: number;
    additionalCharges?: AdditionalCharge[];
    outstandingBill?: number;
    grandTotal: number;
    amountPaid?: number;
    balance?: number;
    notes?: string;
    termsAndConditions?: string;
    pdfPath?: string;
    isDraft: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInvoicePayload {
    companyId: string;
    customerId: string;
    invoiceType?: "invoice" | "proforma";
    invoiceDate?: string;
    dueDate?: string;
    items: { description: string; quantity: number; unitPrice: number; total: number }[];
    subtotal: number;
    additionalCharges?: AdditionalCharge[];
    outstandingBill?: number;
    grandTotal: number;
    notes?: string;
    termsAndConditions?: string;
    isDraft?: boolean;
}

export interface InvoiceListParams {
    page?: number;
    limit?: number;
    status?: string;
    companyId?: string;
    customerId?: string;
    search?: string;
}

export interface InvoiceListResponse {
    success: boolean;
    message: string;
    data: {
        invoices: Invoice[];
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

export interface InvoiceResponse {
    success: boolean;
    message: string;
    data: {
        invoice: Invoice;
    };
}

// ── API ───────────────────────────────────────────────────────────
export const invoicesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /invoices
        getInvoices: builder.query<InvoiceListResponse, InvoiceListParams>({
            query: (params) => ({ url: "/invoices", params }),
            providesTags: (result) =>
                result?.data?.invoices
                    ? [
                        ...result.data.invoices.map((inv) => ({
                            type: "Invoice" as const,
                            id: inv._id,
                        })),
                        { type: "Invoice", id: "LIST" },
                    ]
                    : [{ type: "Invoice", id: "LIST" }],
        }),

        // GET /invoices/:id
        getInvoiceById: builder.query<InvoiceResponse, string>({
            query: (id) => `/invoices/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Invoice", id }],
        }),

        // GET /invoices/customer/:customerId
        getInvoicesByCustomer: builder.query<
            { success: boolean; data: { invoices: Invoice[] } },
            string
        >({
            query: (customerId) => `/invoices/customer/${customerId}`,
            providesTags: [{ type: "Invoice", id: "LIST" }],
        }),

        // GET /invoices/drafts
        getDraftInvoices: builder.query<
            { success: boolean; data: { invoices: Invoice[] } },
            void
        >({
            query: () => "/invoices/drafts",
            providesTags: [{ type: "Invoice", id: "LIST" }],
        }),

        // GET /invoices/statistics
        getInvoiceStatistics: builder.query<
            { success: boolean; data: { stats: Record<string, unknown> } },
            { companyId?: string } | void
        >({
            query: (params) => ({ url: "/invoices/statistics", params: params ?? {} }),
        }),

        // POST /invoices
        createInvoice: builder.mutation<InvoiceResponse, CreateInvoicePayload>({
            query: (body) => ({ url: "/invoices", method: "POST", body }),
            invalidatesTags: [
                { type: "Invoice", id: "LIST" },
                "Dashboard",
            ],
        }),

        // PUT /invoices/:id
        updateInvoice: builder.mutation<
            InvoiceResponse,
            { id: string; data: Partial<CreateInvoicePayload> }
        >({
            query: ({ id, data }) => ({
                url: `/invoices/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
            ],
        }),

        // DELETE /invoices/:id
        deleteInvoice: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/invoices/${id}`, method: "DELETE" }),
            invalidatesTags: (_result, _err, id) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
                "Dashboard",
            ],
        }),

        // POST /invoices/:id/finalize
        finalizeInvoice: builder.mutation<InvoiceResponse, string>({
            query: (id) => ({ url: `/invoices/${id}/finalize`, method: "POST" }),
            invalidatesTags: (_result, _err, id) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
            ],
        }),

        // POST /invoices/:id/mark-paid
        markInvoiceAsPaid: builder.mutation<
            InvoiceResponse,
            { id: string; amountPaid: number }
        >({
            query: ({ id, amountPaid }) => ({
                url: `/invoices/${id}/mark-paid`,
                method: "POST",
                body: { amountPaid },
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
            ],
        }),

        // PUT /invoices/:id/status
        updateInvoiceStatus: builder.mutation<
            InvoiceResponse,
            { id: string; status: Invoice["status"] }
        >({
            query: ({ id, status }) => ({
                url: `/invoices/${id}/status`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Invoice", id },
                { type: "Invoice", id: "LIST" },
            ],
        }),

        // GET /invoices/:id/pdf  (triggers file download)
        generatePDF: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/invoices/${id}/pdf`,
                method: "GET",
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `invoice-${id}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    return { success: true };
                },
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useGetInvoicesByCustomerQuery,
    useGetDraftInvoicesQuery,
    useGetInvoiceStatisticsQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
    useFinalizeInvoiceMutation,
    useMarkInvoiceAsPaidMutation,
    useUpdateInvoiceStatusMutation,
    useGeneratePDFMutation,
} = invoicesApi;
