// ── Generic API response wrapper ─────────────────────────────────
export interface ApiResponse<T> {
  data:       T;
  message:    string;
  success:    boolean;
  statusCode: number;
  timestamp:  string;
  meta?:      PaginationMeta;
}

export interface ApiError {
  message:    string;
  statusCode: number;
  errors?:    Record<string, string[]>;
  code?:      string;
}

export interface PaginationMeta {
  page:        number;
  pageSize:    number;
  total:       number;
  totalPages:  number;
  hasNext:     boolean;
  hasPrev:     boolean;
}

export interface PaginationParams {
  page?:     number;
  pageSize?: number;
  search?:   string;
  sortBy?:   string;
  sortOrder?: "asc" | "desc";
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string | number;
