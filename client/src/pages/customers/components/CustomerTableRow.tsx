import { Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/redux/api/customersApi";
import CustomerStatusBadge from "./CustomerStatusBadge";

interface CustomerTableRowProps {
  customer: Customer;
  isAdmin: boolean;
  onRowClick: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerTableRow = ({
  customer: c,
  isAdmin,
  onRowClick,
  onEdit,
  onDelete,
}: CustomerTableRowProps) => (
  <tr
    onClick={() => onRowClick(c)}
    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
  >
    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
      {c.name}
    </td>
    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
      {c.email ?? "—"}
    </td>
    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
      {c.phone ?? "—"}
    </td>
    {isAdmin && (
      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
        {typeof c.companyId === "object"
          ? (c.companyId as { name: string }).name
          : "—"}
      </td>
    )}
    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
      {c.city ?? "—"}
    </td>
    <td className="px-4 py-3.5">
      <CustomerStatusBadge active={c.isActive} />
    </td>
    <td className="px-4 py-3.5">
      <div
        className="flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(c)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors opacity-0 group-hover:opacity-100"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(c._id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </td>
  </tr>
);

export default CustomerTableRow;
