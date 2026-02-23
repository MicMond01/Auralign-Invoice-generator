const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  },
  sent: {
    label: "Sent",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const cfg = statusConfig[status] ?? statusConfig.draft;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
};

export default InvoiceStatusBadge;
