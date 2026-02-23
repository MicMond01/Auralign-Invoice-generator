import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

interface SidebarUserFooterProps {
  user: User;
  isExpanded: boolean;
  onLogout: () => void;
}

const SidebarUserFooter = ({
  user,
  isExpanded,
  onLogout,
}: SidebarUserFooterProps) => (
  <div className="border-t border-slate-800 p-3 overflow-hidden">
    <div
      className={cn(
        "flex items-center gap-3 mb-2 px-1 transition-all duration-300",
        isExpanded ? "justify-start" : "justify-center"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
        />
        <AvatarFallback className="bg-blue-600 text-white text-xs">
          {user.firstName?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}
      >
        <p className="text-white text-xs font-medium truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-slate-500 text-xs truncate">{user.role}</p>
      </div>
    </div>

    <Button
      variant="ghost"
      size="sm"
      onClick={onLogout}
      className={cn(
        "w-full flex items-center gap-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all justify-start",
        !isExpanded && "justify-center px-0"
      )}
    >
      <LogOut size={18} className="shrink-0" />
      <span
        className={cn(
          "truncate transition-all duration-300",
          isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}
      >
        Sign Out
      </span>
    </Button>
  </div>
);

export default SidebarUserFooter;
