import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Download, Eye, FileText } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import {
    useGetInvoicesQuery,
    useDeleteInvoiceMutation,
    useGeneratePDFMutation,
    useMarkInvoiceAsPaidMutation,
    type Invoice,
} from "@/redux/api/invoicesApi";
import { TOAST_CONFIG } from "@/config/baseConfig";
import { useNavigate } from "react-router-dom";

// ── Status badge ──────────────────────────────────────────────────
const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
    sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const StatusBadge = ({ status }: { status: string }) => (
    <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] ?? statusColors.draft
            }`}
    >
        {status.toUpperCase()}
    </span>
);

// ── Page ──────────────────────────────────────────────────────────
const InvoicesPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching } = useGetInvoicesQuery({ page, limit: 10 });
    const [generatePDF] = useGeneratePDFMutation();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const [markAsPaid] = useMarkInvoiceAsPaidMutation();

    useEffect(() => {
        dispatch(
            setBreadcrumbs([
                { label: "Dashboard", path: "/dashboard" },
                { label: "Invoices" },
            ])
        );
    }, [dispatch]);

    const invoices: Invoice[] = data?.data?.invoices ?? [];
    const total = data?.data?.total ?? 0;
    const pages = data?.data?.pages ?? 1;

    const handleDownloadPDF = async (id: string) => {
        const toastId = toast.loading("Generating PDF…");
        try {
            await generatePDF(id).unwrap();
            toast.dismiss(toastId);
            toast.success(TOAST_CONFIG.MESSAGES.EXPORT_SUCCESS);
        } catch {
            toast.dismiss(toastId);
            toast.error("Failed to generate PDF");
        }
    };

    const handleMarkPaid = async (inv: Invoice) => {
        try {
            await markAsPaid({ id: inv._id, amountPaid: inv.grandTotal }).unwrap();
            toast.success("Invoice marked as paid");
        } catch {
            toast.error(TOAST_CONFIG.MESSAGES.SAVE_ERROR);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteInvoice(id).unwrap();
            toast.success(TOAST_CONFIG.MESSAGES.DELETE_SUCCESS);
        } catch {
            toast.error(TOAST_CONFIG.MESSAGES.DELETE_ERROR);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(amount);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Invoices
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {total} invoice{total !== 1 ? "s" : ""} in total
                    </p>
                </div>
                <button
                    onClick={() => navigate("/dashboard/invoices/create")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus size={16} /> Create Invoice
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                {[
                                    "Invoice #",
                                    "Customer",
                                    "Type",
                                    "Grand Total",
                                    "Status",
                                    "Date",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-slate-400"
                                    >
                                        <FileText
                                            size={40}
                                            className="mx-auto mb-3 opacity-30"
                                        />
                                        <p className="text-sm">No invoices yet.</p>
                                        <button
                                            onClick={() => navigate("/dashboard/invoices/create")}
                                            className="mt-2 text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            Create your first invoice
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => {
                                    const customer =
                                        typeof inv.customerId === "object"
                                            ? (inv.customerId as { name?: string }).name
                                            : "—";

                                    return (
                                        <tr
                                            key={inv._id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                                                #{inv.invoiceNumber}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                                {customer ?? "—"}
                                            </td>
                                            <td className="px-4 py-3.5 capitalize text-slate-600 dark:text-slate-400">
                                                {inv.invoiceType}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                                {formatCurrency(inv.grandTotal)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <StatusBadge status={inv.status} />
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                                {new Date(inv.invoiceDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    {/* Download PDF */}
                                                    <button
                                                        onClick={() => handleDownloadPDF(inv._id)}
                                                        title="Download PDF"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                    >
                                                        <Download size={14} />
                                                    </button>

                                                    {/* Mark as paid (only if not already paid) */}
                                                    {inv.status !== "paid" &&
                                                        inv.status !== "cancelled" && (
                                                            <button
                                                                onClick={() => handleMarkPaid(inv)}
                                                                title="Mark as Paid"
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors text-xs font-medium"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                        )}

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() =>
                                                            toast("Delete this invoice?", {
                                                                action: {
                                                                    label: "Delete",
                                                                    onClick: () => handleDelete(inv._id),
                                                                },
                                                            })
                                                        }
                                                        title="Delete"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs text-slate-500">
                            Page {page} of {pages}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                                disabled={page >= pages}
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoicesPage;
