import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Column {
  key:   string;
  label: string;
}

interface DataTableProps<T extends Record<string, unknown> & { id: string }> {
  columns:       Column[];
  data:          T[];
  isLoading:     boolean;
  onDelete?:     (id: string) => void;
  totalPages?:   number;
  currentPage?:  number;
  onPageChange?: (page: number) => void;
}

function DataTable<T extends Record<string, unknown> & { id: string }>({
  columns, data, isLoading, onDelete, totalPages = 1, currentPage = 1, onPageChange,
}: DataTableProps<T>) {

  const confirmDelete = (id: string) => {
    toast("Are you sure?", {
      action: {
        label: "Delete",
        onClick: () => onDelete?.(id),
      },
    });
  };

  if (isLoading) return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              {onDelete && <th className="px-4 py-3 w-12" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">No records found.</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      {String(row[col.key] ?? "—")}
                    </td>
                  ))}
                  {onDelete && (
                    <td className="px-4 py-3.5">
                      <button onClick={() => confirmDelete(row.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
          <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage <= 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
