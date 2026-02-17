import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import { TOAST_CONFIG } from "@/config/baseConfig";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Dashboard", path: "/dashboard" }, { label: "Settings" }]));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">Profile</h2>
        <p className="text-slate-500 text-sm">{user?.email}</p>
        <button
          onClick={() => toast.info(TOAST_CONFIG.MESSAGES.SAVE_SUCCESS)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
