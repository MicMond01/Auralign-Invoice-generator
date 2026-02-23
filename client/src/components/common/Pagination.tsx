interface PaginationProps {
  page: number;
  pages: number;
  total?: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, pages, total, onPageChange }: PaginationProps) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
      <span className="text-xs text-slate-500">
        Page {page} of {pages}
        {total !== undefined ? ` (${total} total)` : ""}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
