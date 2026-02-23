import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { ROUTES, TOAST_CONFIG } from "@/config/baseConfig";
import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
  useMarkInvoiceAsPaidMutation,
  useGeneratePDFMutation,
} from "@/redux/api/invoicesApi";

import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import InvoiceTableRow from "./components/InvoiceTableRow";
import InvoiceEmptyState from "./components/InvoiceEmptyState";

const InvoicesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Dashboard", path: "/dashboard" },
        { label: "Invoices" },
      ])
    );
  }, [dispatch]);

  const { data, isLoading } = useGetInvoicesQuery({ page, limit: 10 });
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [markPaid] = useMarkInvoiceAsPaidMutation();
  const [generatePDF] = useGeneratePDFMutation();

  const invoices = data?.data?.invoices ?? [];
  const total = data?.data?.total ?? 0;
  const pages = data?.data?.pages ?? 1;

  const handleDownload = async (id: string) => {
    try {
      await generatePDF(id).unwrap();
      toast.success("PDF generated");
    } catch {
      toast.error(TOAST_CONFIG.MESSAGES.FETCH_ERROR);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const invoice = invoices.find(inv => inv._id === id);
      const amountPaid = invoice?.balance ?? invoice?.grandTotal ?? 0;
      await markPaid({ id, amountPaid }).unwrap();
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle={`${total} invoice${total !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={() => navigate(ROUTES.CREATE_INVOICE)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} /> New Invoice
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <InvoiceEmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  {["Invoice #", "Customer", "Amount", "Status", "Date", "Actions"].map((h) => (
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
                {invoices.map((inv) => (
                  <InvoiceTableRow
                    key={inv._id}
                    invoice={inv}
                    onDownload={handleDownload}
                    onMarkPaid={handleMarkPaid}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          pages={pages}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default InvoicesPage;
