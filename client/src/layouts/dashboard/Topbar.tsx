import { useState } from "react";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebarCollapse } from "@/redux/slices/uiSlice";
import { selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { APP_META } from "@/config/baseConfig";
import { Button } from "@/components/ui/button";

import TopbarSearch from "./components/TopbarSearch";
import TopbarActions from "./components/TopbarActions";
import MobileMenu from "./components/MobileMenu";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

      <TopbarSearch />

      <div className="flex-1 md:hidden" />

      <TopbarActions />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Topbar;
