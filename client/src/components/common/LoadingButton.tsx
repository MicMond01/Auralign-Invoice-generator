import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variantClass = {
  primary:   "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  danger:    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  ghost:     "bg-transparent text-slate-600 hover:bg-slate-100",
};

const LoadingButton = ({ loading = false, variant = "primary", className, children, disabled, ...props }: LoadingButtonProps) => (
  <button
    disabled={loading || disabled}
    className={cn(
      "relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed",
      variantClass[variant],
      className
    )}
    {...props}
  >
    {loading && (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    {children}
  </button>
);

export default LoadingButton;
