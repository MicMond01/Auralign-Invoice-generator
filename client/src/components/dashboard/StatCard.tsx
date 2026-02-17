import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label:   string;
  value:   string;
  change:  string;
  icon:    LucideIcon;
  color:   "blue" | "green" | "purple" | "orange";
}

const colorMap: Record<StatCardProps["color"], string> = {
  blue:   "bg-blue-50   text-blue-600   dark:bg-blue-900/30   dark:text-blue-400",
  green:  "bg-green-50  text-green-600  dark:bg-green-900/30  dark:text-green-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

const StatCard = ({ label, value, change, icon: Icon, color }: StatCardProps) => {
  const isPositive = change.startsWith("+");
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon size={20} />
        </div>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
          isPositive ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                     : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-slate-500 text-sm mt-0.5">{label}</p>
    </div>
  );
};

export default StatCard;
