import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

const ErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage = "An unexpected error occurred.";
    let errorStatus = 500;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || error.data?.message || "Page not found";
        errorStatus = error.status;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center space-y-6 border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-500">
                    <AlertTriangle size={32} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Oops!</h1>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                        {errorStatus === 404 ? "Page Not Found" : "Something went wrong"}
                    </p>
                    <p className="text-slate-500 text-sm">
                        {errorMessage}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium transition-colors"
                    >
                        <RefreshCcw size={18} />
                        Reload Page
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <Home size={18} />
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;
