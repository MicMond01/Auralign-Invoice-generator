// ================================================================
//  FAJLINK TECHNOLOGY — Base Application Configuration
//  Single source of truth for all env-driven and static config
// ================================================================

// ── Environment ─────────────────────────────────────────────────
export const ENV = {
  MODE: import.meta.env.MODE as "development" | "production" | "staging",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  IS_STAGING: import.meta.env.MODE === "staging",
} as const;

// ── API ──────────────────────────────────────────────────────────
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  VERSION: import.meta.env.VITE_API_VERSION ?? "v1",
  TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 30_000),
  RETRY_ATTEMPTS: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS ?? 3),
  RETRY_DELAY_MS: Number(import.meta.env.VITE_API_RETRY_DELAY_MS ?? 1_000),
  get FULL_URL() {
    return `${this.BASE_URL}/${this.VERSION}`;
  },
} as const;

// ── Auth ─────────────────────────────────────────────────────────
export const AUTH_CONFIG = {
  TOKEN_KEY: "fajlink_auth_token",
  REFRESH_TOKEN_KEY: "fajlink_refresh_token",
  PERSIST_KEY: "fajlink_persist_root",
  SESSION_TIMEOUT_MS: Number(
    import.meta.env.VITE_SESSION_TIMEOUT_MS ?? 3_600_000,
  ), // 1hr
  TOKEN_REFRESH_BEFORE_EXPIRY_MS: 300_000, // 5 min
  MFA_ENABLED: import.meta.env.VITE_MFA_ENABLED === "true",
} as const;

// ── Pagination ───────────────────────────────────────────────────
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const;

// ── Routing ──────────────────────────────────────────────────────
export const ROUTES = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  // Dashboard
  DASHBOARD: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
  // Users
  USERS: "/dashboard/users",
  USER_DETAIL: (id: string) => `/dashboard/users/${id}`,
  // Settings
  SETTINGS: "/dashboard/settings",
  SETTINGS_PROFILE: "/dashboard/settings/profile",
  SETTINGS_SECURITY: "/dashboard/settings/security",
  SETTINGS_BILLING: "/dashboard/settings/billing",
  // Reports
  REPORTS: "/dashboard/reports",
  // Errors
  NOT_FOUND: "/404",
  SERVER_ERROR: "/500",
  UNAUTHORIZED: "/401",
} as const;

// ── Feature Flags ────────────────────────────────────────────────
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_FEATURE_ANALYTICS !== "false",
  ENABLE_EXPORT_PDF: import.meta.env.VITE_FEATURE_EXPORT_PDF !== "false",
  ENABLE_DARK_MODE: import.meta.env.VITE_FEATURE_DARK_MODE !== "false",
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_FEATURE_NOTIFICATIONS !== "false",
  ENABLE_2FA: import.meta.env.VITE_FEATURE_2FA === "true",
  ENABLE_AUDIT_LOG: import.meta.env.VITE_FEATURE_AUDIT_LOG === "true",
  ENABLE_MULTI_TENANT: import.meta.env.VITE_FEATURE_MULTI_TENANT === "true",
} as const;

// ── Toast / Notification ─────────────────────────────────────────
export const TOAST_CONFIG = {
  DURATION_MS: 4_000,
  POSITION: "top-right" as const,
  MAX_TOASTS: 5,
  // Preset messages
  MESSAGES: {
    SAVE_SUCCESS: "Changes saved successfully.",
    SAVE_ERROR: "Failed to save changes. Please try again.",
    DELETE_SUCCESS: "Record deleted successfully.",
    DELETE_ERROR: "Failed to delete record.",
    FETCH_ERROR: "Failed to load data. Please refresh.",
    LOGIN_SUCCESS: "Welcome back! Redirecting…",
    LOGIN_ERROR: "Invalid credentials. Please try again.",
    LOGOUT_SUCCESS: "You've been signed out.",
    REGISTER_SUCCESS: "Account created! Please verify your email.",
    REGISTER_ERROR: "Registration failed. Please try again.",
    NETWORK_ERROR: "Network error. Check your connection.",
    UNAUTHORIZED: "Session expired. Please log in again.",
    FORBIDDEN: "You don't have permission to do this.",
    COPY_SUCCESS: "Copied to clipboard.",
    EXPORT_SUCCESS: "Export ready for download.",
    UPLOAD_SUCCESS: "File uploaded successfully.",
    UPLOAD_ERROR: "File upload failed.",
    FORM_ERROR: "Please fix the errors before submitting.",
  },
} as const;

// ── Upload ───────────────────────────────────────────────────────
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ] as const,
  ALLOWED_DOC_TYPES: [
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ] as const,
} as const;

// ── Theming ──────────────────────────────────────────────────────
export const THEME_CONFIG = {
  DEFAULT_THEME: "light" as "light" | "dark" | "system",
  STORAGE_KEY: "fajlink_theme",
  PRIMARY_COLOR: "#2563eb",
  SIDEBAR_WIDTH: "256px",
  SIDEBAR_COLLAPSED_WIDTH: "72px",
  TOPBAR_HEIGHT: "64px",
} as const;

// ── Table ────────────────────────────────────────────────────────
export const TABLE_CONFIG = {
  DEFAULT_COLUMN_WIDTH: 150,
  MIN_COLUMN_WIDTH: 80,
  MAX_COLUMN_WIDTH: 400,
  ROW_HEIGHT: 52,
  HEADER_HEIGHT: 44,
} as const;

// ── Date / Time ──────────────────────────────────────────────────
export const DATE_CONFIG = {
  DEFAULT_FORMAT: "dd MMM yyyy",
  DEFAULT_DATETIME_FORMAT: "dd MMM yyyy, HH:mm",
  DEFAULT_TIME_FORMAT: "HH:mm",
  TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
} as const;

// ── Analytics / Telemetry ─────────────────────────────────────────
export const ANALYTICS_CONFIG = {
  ENABLED: FEATURE_FLAGS.ENABLE_ANALYTICS,
  TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID ?? "",
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN ?? "",
  LOG_ROCKET_ID: import.meta.env.VITE_LOG_ROCKET_ID ?? "",
} as const;

// ── App Meta ─────────────────────────────────────────────────────
export const APP_META = {
  NAME: "Fajlink Technology",
  SHORT_NAME: "Fajlink",
  DESCRIPTION: "Enterprise SaaS Platform",
  VERSION: import.meta.env.VITE_APP_VERSION ?? "1.0.0",
  SUPPORT_EMAIL: "support@fajlink.com",
  DOCS_URL: "https://docs.fajlink.com",
  GITHUB_URL: "https://github.com/fajlink",
} as const;

// ── Permissions / Roles ──────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.SUPER_ADMIN]: 5,
  [ROLES.ADMIN]: 4,
  [ROLES.MANAGER]: 3,
  [ROLES.USER]: 2,
  [ROLES.VIEWER]: 1,
};

// ── HTTP Status Codes ─────────────────────────────────────────────
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;
