import { ChevronDown } from "lucide-react";
import type { Company } from "@/redux/api/companiesApi";

interface CompanyFilterDropdownProps {
  companies: Company[];
  value: string;
  onChange: (value: string) => void;
}

const CompanyFilterDropdown = ({
  companies,
  value,
  onChange,
}: CompanyFilterDropdownProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Companies</option>
      {companies.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>
    <ChevronDown
      size={14}
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
  </div>
);

export default CompanyFilterDropdown;
