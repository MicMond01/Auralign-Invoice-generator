import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FileBarChart, Settings,
  ChevronLeft, ChevronRight, LogOut, Bell,
  Building,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebarCollapse } from "@/redux/slices/uiSlice";
import { logout } from "@/redux/slices/authSlice";
import { selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { ROUTES, APP_META, THEME_CONFIG } from "@/config/baseConfig";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",  to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Companies",  to: ROUTES.COMPANIES, icon: Building },
  { label: "Users",      to: ROUTES.USERS,     icon: Users },
  { label: "Reports",    to: ROUTES.REPORTS,   icon: FileBarChart },
  { label: "Settings",   to: ROUTES.SETTINGS,  icon: Settings },
] as const;

const Sidebar = () => {
  const dispatch   = useAppDispatch();
  const collapsed  = useAppSelector(selectSidebarCollapsed);
  const user       = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully.");
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-40 border-r border-slate-700/50 flex flex-col transition-all duration-300"
      style={{ width: collapsed ? THEME_CONFIG.SIDEBAR_COLLAPSED_WIDTH : THEME_CONFIG.SIDEBAR_WIDTH }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 min-h-[64px]">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">FT</span>
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-sm truncate">{APP_META.SHORT_NAME}</span>
        )}
        <button
          onClick={() => dispatch(toggleSidebarCollapse())}
          className="ml-auto text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-700/50 p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.firstName?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-slate-500 text-xs truncate">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
