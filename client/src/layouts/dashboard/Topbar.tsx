import { Bell, Search, Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/redux/slices/uiSlice";
import { selectTheme, selectBreadcrumbs } from "@/redux/selectors/uiSelectors";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";

const Topbar = () => {
  const dispatch     = useAppDispatch();
  const theme        = useAppSelector(selectTheme);
  const breadcrumbs  = useAppSelector(selectBreadcrumbs);
  const user         = useAppSelector(selectCurrentUser);

  return (
    <header className="h-16 border-b border-slate-200  flex items-center px-6 gap-4 shrink-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-slate-500 gap-1 flex-1">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="">/</span>}
            <span className={i === breadcrumbs.length - 1 ? " font-medium" : ""}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={15} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search…"
          className="pl-9 pr-4 py-1.5 text-sm  rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Avatar */}
      {user && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          {user.firstName?.[0]?.toUpperCase()}
        </div>
      )}
    </header>
  );
};

export default Topbar;
