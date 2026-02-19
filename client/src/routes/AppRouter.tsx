import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES, ROLES } from "@/config/baseConfig";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import FullPageSpinner from "@/components/common/FullPageSpinner";

// ── Lazy imports ───────────────────────────────────────────────
const DashboardLayout = lazy(() => import("@/layouts/dashboard/DashboardLayout"));
const AuthLayout = lazy(() => import("@/layouts/auth/AuthLayout"));

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));

// Admin
const Companies = lazy(() => import("@/pages/admin/companies/Companies"));
const CompanyDetailPage = lazy(() => import("@/pages/admin/companies/CompanyDetailPage"));


const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const InvoicesPage = lazy(() => import("@/pages/invoices/InvoicesPage"));
const CreateInvoicePage = lazy(() => import("@/pages/invoices/CreateInvoicePage"));
const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));

const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/errors/UnauthorizedPage"));
const ServerErrorPage = lazy(() => import("@/pages/errors/ServerErrorPage"));
const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));

import ErrorBoundary from "@/components/common/ErrorBoundary";

const router = createBrowserRouter([
  // ── Public / Auth routes ───────────────────────────────────
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <PublicRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  // ── Protected routes ──────────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: "/dashboard/invoices", element: <InvoicesPage /> },
          { path: "/dashboard/invoices/create", element: <CreateInvoicePage /> },
          { path: "/dashboard/customers", element: <CustomersPage /> },
          { path: ROUTES.REPORTS, element: <ReportsPage /> },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
          // Admin-only
          {
            element: <ProtectedRoute requiredRole={ROLES.ADMIN} />,
            children: [
              { path: ROUTES.USERS, element: <UsersPage /> },
              { path: ROUTES.COMPANIES, element: <Companies /> },
              { path: "/dashboard/admin/companies/:id", element: <CompanyDetailPage /> },
            ],
          },
        ],
      },
    ],
  },
  // ── Error pages ───────────────────────────────────────────
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
  { path: ROUTES.UNAUTHORIZED, element: <UnauthorizedPage /> },
  { path: ROUTES.SERVER_ERROR, element: <ServerErrorPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

const AppRouter = () => (
  <Suspense fallback={<FullPageSpinner />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
