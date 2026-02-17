import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label:        string;
  error?:       string;
  registration: UseFormRegisterReturn;
  hint?:        string;
}

const FormInput = ({ label, error, registration, hint, ...props }: FormInputProps) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-300">{label}</label>
    <input
      {...registration}
      {...props}
      className={cn(
        "w-full px-3 py-2.5 bg-white/5 border rounded-lg text-white placeholder-slate-500 text-sm outline-none transition-all",
        "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        error ? "border-red-500" : "border-white/10 hover:border-white/20"
      )}
    />
    {hint  && !error && <p className="text-xs text-slate-500">{hint}</p>}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export default FormInput;
