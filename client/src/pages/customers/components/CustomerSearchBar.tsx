import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface CustomerSearchBarProps {
  onSearchChange: (value: string) => void;
}

const CustomerSearchBar = ({ onSearchChange }: CustomerSearchBarProps) => {
  const [search, setSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(search), 400);
    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email or phone..."
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default CustomerSearchBar;
