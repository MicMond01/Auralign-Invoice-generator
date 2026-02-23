import { Search } from "lucide-react";

const TopbarSearch = () => (
  <div className="relative hidden md:flex items-center ml-4 flex-1 max-w-md">
    <Search size={16} className="absolute left-3 text-slate-400" />
    <input
      type="text"
      placeholder="Search..."
      className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 w-full outline-none transition-all"
    />
  </div>
);

export default TopbarSearch;
