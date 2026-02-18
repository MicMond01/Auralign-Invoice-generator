import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppSelector } from "@/store/hooks";
import { selectSidebarCollapsed } from "@/redux/selectors/uiSelectors";
import { THEME_CONFIG } from "@/config/baseConfig";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

const DashboardLayout = () => {
  const collapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <div className="flex h-screen  overflow-hidden">
      <Sidebar />
      <div
        className="flex flex-col flex-1 overflow-hidden transition-all duration-300"
        style={{ marginLeft: collapsed ? THEME_CONFIG.SIDEBAR_COLLAPSED_WIDTH : THEME_CONFIG.SIDEBAR_WIDTH }}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
                    <Breadcrumbs />

          <Outlet />
        </main>
      </div>
    </div>

  );
};

export default DashboardLayout;
