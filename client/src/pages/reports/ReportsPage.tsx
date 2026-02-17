import { useEffect } from "react";
import { toast } from "sonner";
import { FileDown } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { TOAST_CONFIG } from "@/config/baseConfig";

const ReportsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Dashboard", path: "/dashboard" }, { label: "Reports" }]));
  }, [dispatch]);

  const handleExport = () => toast.success(TOAST_CONFIG.MESSAGES.EXPORT_SUCCESS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Generate and download platform reports</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <FileDown size={16} /> Export PDF
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <p className="text-slate-400">Reports will appear here.</p>
      </div>
    </div>
  );
};

export default ReportsPage;
