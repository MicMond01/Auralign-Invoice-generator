import { Download, CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import type { Invoice } from "@/redux/api/invoicesApi";

interface InvoiceTableRowProps {
  invoice: Invoice;
  onDownload: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
}

const InvoiceTableRow = ({
  invoice: inv,
  onDownload,
  onMarkPaid,
  onDelete,
}: InvoiceTableRowProps) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
      {inv.invoiceNumber}
    </td>
    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
      {typeof inv.customerId === "object"
        ? (inv.customerId as { name: string }).name
        : "—"}
    </td>
    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
      {formatCurrency(inv.grandTotal ?? 0)}
    </td>
    <td className="px-4 py-3.5">
      <InvoiceStatusBadge status={inv.status} />
    </td>
    <td className="px-4 py-3.5 text-slate-500 text-xs">
      {format(new Date(inv.createdAt), "dd MMM yyyy")}
    </td>
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onDownload(inv._id)}
          title="Download PDF"
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Download size={14} />
        </button>
        {inv.status !== "paid" && (
          <button
            onClick={() => onMarkPaid(inv._id)}
            title="Mark as paid"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors opacity-0 group-hover:opacity-100"
          >
            <CheckCircle2 size={14} />
          </button>
        )}
        <button
          onClick={() => onDelete(inv._id)}
          title="Delete"
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </td>
  </tr>
);

export default InvoiceTableRow;
