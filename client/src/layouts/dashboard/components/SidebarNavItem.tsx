import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  isExpanded: boolean;
}

const SidebarNavItem = ({
  to,
  label,
  icon: Icon,
  isExpanded,
}: SidebarNavItemProps) => (
  <NavLink
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
  </NavLink>
);

export default SidebarNavItem;
