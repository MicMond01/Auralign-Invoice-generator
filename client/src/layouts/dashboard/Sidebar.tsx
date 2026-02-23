import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  Building,
  FileText,
  UserCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/redux/slices/authSlice";
import { selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { ROUTES, APP_META } from "@/config/baseConfig";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import SidebarNavItem from "./components/SidebarNavItem";
import SidebarUserFooter from "./components/SidebarUserFooter";

const navItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Companies", to: ROUTES.COMPANIES, icon: Building, adminOnly: true },
  { label: "Customers", to: "/dashboard/customers", icon: UserCheck },
  { label: "Invoices", to: "/dashboard/invoices", icon: FileText },
  { label: "Users", to: ROUTES.USERS, icon: Users, adminOnly: true },
  { label: "Reports", to: ROUTES.REPORTS, icon: FileBarChart },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
] as const;

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectCurrentUser);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = !collapsed || isHovered;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully.");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-40 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out hidden md:flex",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => collapsed && setIsHovered(true)}
      onMouseLeave={() => collapsed && setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 min-h-[64px] overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">FT</span>
        </div>
        <span
          className={cn(
            "text-white font-semibold text-sm truncate transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0 w-0"
          )}
        >
          {APP_META.SHORT_NAME}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems
          .filter((item) => !("adminOnly" in item && item.adminOnly) || isAdmin)
          .map(({ label, to, icon }) => (
            <SidebarNavItem
              key={to}
              to={to}
              label={label}
              icon={icon}
              isExpanded={isExpanded}
            />
          ))}
      </nav>

      {/* User footer */}
      {user && (
        <SidebarUserFooter
          user={user}
          isExpanded={isExpanded}
          onLogout={handleLogout}
        />
      )}
    </aside>
  );
};

export default Sidebar;
