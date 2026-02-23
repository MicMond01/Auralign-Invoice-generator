import { NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, FileBarChart, Settings, Building } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/redux/slices/authSlice";
import { ROUTES } from "@/config/baseConfig";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

const allNavItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Companies", to: ROUTES.COMPANIES, icon: Building, adminOnly: true },
  { label: "Users", to: ROUTES.USERS, icon: Users, adminOnly: true },
  { label: "Reports", to: ROUTES.REPORTS, icon: FileBarChart },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
] as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const dispatch = useAppDispatch();
  const { isAdmin } = useAuthStore();

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully.");
    onClose();
  };

  const navItems = allNavItems.filter(
    (item) => !("adminOnly" in item && item.adminOnly) || isAdmin
  );

  return (
    <div className="absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg md:hidden flex flex-col p-4 space-y-2 animate-in slide-in-from-top-5 duration-200">
      {navItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
              isActive
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
      <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
