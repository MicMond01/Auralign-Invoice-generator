import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { TOAST_CONFIG } from "@/config/baseConfig";
import CompanyProfileSettings from "./components/CompanyProfileSettings";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Dashboard", path: "/dashboard" }, { label: "Settings" }]));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompanyProfileSettings />
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 self-start">
          <h2 className="font-semibold text-slate-900 dark:text-white">Account Info</h2>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase">Email</label>
              <p className="text-slate-800 font-medium text-sm">{user?.email}</p>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase">Role</label>
              <p className="text-slate-800 font-medium text-sm capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
