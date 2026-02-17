export interface QueryArgs {
  url:     string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?:   unknown;
  params?: Record<string, string | number | boolean | undefined>;
}
