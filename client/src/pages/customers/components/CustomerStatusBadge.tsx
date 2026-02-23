interface CustomerStatusBadgeProps {
  active: boolean;
}

const CustomerStatusBadge = ({ active }: CustomerStatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      active
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

export default CustomerStatusBadge;
