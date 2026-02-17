import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputField = ({ label, type, placeholder, registration, error, icon: Icon }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={18} />
        </div>
        <input
          {...registration}
          type={actualType}
          placeholder={placeholder}
          className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-white border ${
            error ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50"
          } transition-all outline-none text-slate-900 placeholder:text-slate-400 text-base`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-2 active:bg-slate-50 rounded-lg transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-left-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField