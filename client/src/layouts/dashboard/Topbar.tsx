import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  Building,
  LogOut,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, toggleSidebarCollapse } from "@/redux/slices/uiSlice";
import { selectTheme, selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { ROUTES, APP_META } from "@/config/baseConfig";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Companies", to: ROUTES.COMPANIES, icon: Building },
  { label: "Users", to: ROUTES.USERS, icon: Users },
  { label: "Reports", to: ROUTES.REPORTS, icon: FileBarChart },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
] as const;

const Topbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectCurrentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully.");
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-30 transition-all duration-300">
      
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Desktop Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => dispatch(toggleSidebarCollapse())}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      {/* Logo (Mobile Only) */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">FT</span>
        </div>
        <span className="font-semibold text-sm">{APP_META.SHORT_NAME}</span>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center ml-4 flex-1 max-w-md">
        <Search size={16} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 w-full outline-none transition-all"
        />
      </div>

      <div className="flex-1 md:hidden" /> 

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
          className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </Button>

        {/* Avatar Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`} alt={user.firstName} />
                  <AvatarFallback>{user.firstName?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Profile settings clicked")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Billing clicked")}>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Settings clicked")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile Menu Dropdown (Expand Down) */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg md:hidden flex flex-col p-4 space-y-2 animate-in slide-in-from-top-5 duration-200">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
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
      )}
    </header>
  );
};

export default Topbar;
