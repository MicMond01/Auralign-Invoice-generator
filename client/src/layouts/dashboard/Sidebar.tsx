import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  Building,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/redux/slices/authSlice";
import { selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { ROUTES, APP_META, THEME_CONFIG } from "@/config/baseConfig";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Companies", to: ROUTES.COMPANIES, icon: Building },
  { label: "Users", to: ROUTES.USERS, icon: Users },
  { label: "Reports", to: ROUTES.REPORTS, icon: FileBarChart },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
] as const;

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectCurrentUser);
  const [isHovered, setIsHovered] = useState(false);

  // Effective state: if collapsed globally but hovered locally, treat as expanded for visual purposes
  const isExpanded = !collapsed || isHovered;

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
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <Icon size={20} className="shrink-0" />
            <span
              className={cn(
                "truncate transition-all duration-300",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              {label}
            </span>
            
            {/* Tooltip-like label for collapsed state if not hovering sidebar (optional, but since we expand on hover, we might not need it) 
                However, if user prefers just icons, the expansion handles it. 
            */}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-800 p-3 overflow-hidden">
        {user && (
          <div className={cn("flex items-center gap-3 mb-2 px-1 transition-all duration-300", isExpanded ? "justify-start" : "justify-center")}>
             <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`} />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {user.firstName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            
            <div className={cn("overflow-hidden transition-all duration-300", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0")}>
              <p className="text-white text-xs font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-slate-500 text-xs truncate">{user.role}</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all justify-start",
            !isExpanded && "justify-center px-0"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          <span className={cn("truncate transition-all duration-300", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0")}>
            Sign Out
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
