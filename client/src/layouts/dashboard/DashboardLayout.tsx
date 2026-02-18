import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppSelector } from "@/store/hooks";
import { selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { THEME_CONFIG } from "@/config/baseConfig";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const collapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Sidebar />
      
      <div
        className={cn(
          "flex flex-col flex-1 h-full overflow-hidden transition-all duration-300 ease-in-out ml-0",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
