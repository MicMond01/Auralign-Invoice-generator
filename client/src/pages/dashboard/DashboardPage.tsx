import { useEffect } from "react";
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBreadcrumbs } from "@/redux/slices/uiSlice";
import { selectCurrentUser } from "@/redux/selectors/authSelectors";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/charts/RevenueChart";

const stats = [
  { label: "Total Users",    value: "12,340",  change: "+12%",  icon: Users,      color: "blue"   },
  { label: "Revenue",        value: "$84,320", change: "+8.2%", icon: DollarSign, color: "green"  },
  { label: "Growth Rate",    value: "24.5%",   change: "+3.1%", icon: TrendingUp, color: "purple" },
  { label: "Active Sessions",value: "1,204",   change: "-2%",   icon: Activity,   color: "orange" },
] as const;

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Dashboard" }]));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Good morning, {user?.firstName ?? "there"} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue Overview</h2>
          <RevenueChart />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <p className="text-slate-400 text-sm">No recent activity.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
