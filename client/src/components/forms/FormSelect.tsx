import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";
const labelCls =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, children, ...rest }, ref) => (
    <div>
      <label className={labelCls}>
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        <select
          ref={ref}
          className={`${inputCls} appearance-none pr-8`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
