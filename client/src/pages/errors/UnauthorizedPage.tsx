import { Link } from "react-router-dom";
import { ROUTES } from "@/config/baseConfig";

const UnauthorizedPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
    <h1 className="text-8xl font-black text-slate-200 dark:text-slate-700">401</h1>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Unauthorized</h2>
    <p className="text-slate-400 mt-2 mb-6">You don't have permission to access this page.</p>
    <Link to={ROUTES.DASHBOARD} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
      Go to Dashboard
    </Link>
  </div>
);

export default UnauthorizedPage;
