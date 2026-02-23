import { Bell, Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/redux/slices/uiSlice";
import { selectTheme } from "@/redux/selectors/uiSelectors";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { logout } from "@/redux/slices/authSlice";
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
import { toast } from "sonner";

const TopbarActions = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully.");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
        className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
      </Button>

      {/* Avatar dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full ml-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
                  alt={user.firstName}
                />
                <AvatarFallback>
                  {user.firstName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.info("Profile settings clicked")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Billing clicked")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Settings clicked")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default TopbarActions;
