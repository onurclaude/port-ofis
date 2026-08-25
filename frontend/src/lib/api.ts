import type {
  AdminCategory,
  AdminProduct,
  AdminService,
  Category,
  CategoryWriteRequest,
  ContactMessage,
  ContactRequest,
  LoginRequest,
  LoginResponse,
  Paginated,
  Product,
  ProductWriteRequest,
  Service,
  ServiceWriteRequest,
  SiteSettings,
} from "@/lib/types";

/** Public, browser-facing base URL. Client Components always use this directly. */
const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Resolves the API base URL for the environment the calling code is actually
 * executing in — not by which kind of component it was authored as.
 *
 * - Server-side (Server Components, Route Handlers, `generateMetadata`, and
 *   the server-rendered pass of Client Components): prefer the server-only
 *   `API_BASE_URL_INTERNAL` (e.g. `http://backend:8080` inside Docker
 *   Compose, where `localhost` inside the frontend container does not
 *   resolve to the backend container). Falls back to the public URL when
 *   unset, which is always true outside Docker Compose (e.g. `npm run dev`).
 * - Client-side (browser): always `NEXT_PUBLIC_API_BASE_URL`.
 *   `API_BASE_URL_INTERNAL` has no `NEXT_PUBLIC_` prefix, so Next.js never
 *   bundles it for the client — it must never be read outside this
 *   server-only branch.
 */
export function resolveBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL_INTERNAL ?? PUBLIC_API_BASE_URL;
  }
  return PUBLIC_API_BASE_URL;
}

export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors: { field: string; message: string }[];

  constructor(status: number, code: string, message: string, fieldErrors: { field: string; message: string }[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/** Thrown for network failures / unreachable API / malformed base URL, as distinct from a well-formed HTTP error. */
export class ApiNetworkError extends Error {
  constructor(message = "Sunucuya ulaşılamıyor.") {
    super(message);
    this.name = "ApiNetworkError";
  }
}

/** Cache tags used for on-demand revalidation of public, admin-curated content. See `/api/revalidate`. */
export type RevalidateTag = "services" | "categories" | "products" | "site-settings";

interface FetchOptions extends RequestInit {
  /** Next.js ISR revalidation window in seconds, for server-side calls only. */
  revalidate?: number;
  /** Next.js cache tag(s) for this fetch, for server-side calls only. Enables on-demand revalidation via `revalidateTag`. */
  tags?: RevalidateTag[];
  token?: string;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate, tags, token, headers, ...rest } = options;
  const baseUrl = resolveBaseUrl();

  if (!baseUrl) {
    throw new ApiNetworkError("API adresi yapılandırılmamış (NEXT_PUBLIC_API_BASE_URL).");
  }

  let res: Response;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      ...rest,
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(revalidate !== undefined || tags ? { next: { ...(revalidate !== undefined ? { revalidate } : {}), ...(tags ? { tags } : {}) } } : {}),
    });
  } catch {
    throw new ApiNetworkError();
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    if (body && typeof body === "object" && "code" in body) {
      throw new ApiError(res.status, body.code, body.message, body.fieldErrors ?? []);
    }
    throw new ApiError(res.status, "UNKNOWN", "Beklenmeyen bir hata oluştu.");
  }

  return body as T;
}

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

const REVALIDATE_SECONDS = 300; // content is admin-curated and changes rarely

export const getServices = () => request<Service[]>("/api/services", { revalidate: REVALIDATE_SECONDS, tags: ["services"] });

export const getService = (slug: string) =>
  request<Service>(`/api/services/${slug}`, { revalidate: REVALIDATE_SECONDS, tags: ["services"] });

export const getCategories = () => request<Category[]>("/api/categories", { revalidate: REVALIDATE_SECONDS, tags: ["categories"] });

export const getCategory = (slug: string) =>
  request<Category>(`/api/categories/${slug}`, { revalidate: REVALIDATE_SECONDS, tags: ["categories"] });

export const getProducts = (params: { categorySlug?: string; page?: number; size?: number } = {}) => {
  const qs = new URLSearchParams();
  if (params.categorySlug) qs.set("categorySlug", params.categorySlug);
  qs.set("page", String(params.page ?? 0));
  qs.set("size", String(params.size ?? 12));
  return request<Paginated<Product>>(`/api/products?${qs.toString()}`, { revalidate: 60, tags: ["products"] });
};

export const getProduct = (slug: string) =>
  request<Product>(`/api/products/${slug}`, { revalidate: REVALIDATE_SECONDS, tags: ["products"] });

export const postContact = (data: ContactRequest) =>
  request<ContactMessage>("/api/contact", { method: "POST", body: JSON.stringify(data) });

export const getSiteSettings = () =>
  request<SiteSettings>("/api/site-settings", { revalidate: REVALIDATE_SECONDS, tags: ["site-settings"] });

// ---------------------------------------------------------------------------
// On-demand revalidation
// ---------------------------------------------------------------------------

/**
 * Best-effort: asks the Next.js server to drop its ISR cache for `tag` so the
 * public site reflects an admin write immediately, instead of waiting for the
 * `REVALIDATE_SECONDS` fallback. Runs client-side (the admin panel talks to
 * the backend directly from the browser), so it hits our own `/api/revalidate`
 * Route Handler rather than `request()`/`resolveBaseUrl()`, which target the
 * Spring Boot API. Never throws — a failure here must not affect admin UX,
 * since the write itself already succeeded and the time-based fallback still
 * applies.
 */
function triggerRevalidate(token: string, tag: RevalidateTag): void {
  fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tag }),
  })
    .then((res) => {
      if (!res.ok) console.warn(`Revalidate isteği başarısız oldu (tag: ${tag}): HTTP ${res.status}`);
    })
    .catch((err) => {
      console.warn(`Revalidate isteği başarısız oldu (tag: ${tag}):`, err);
    });
}

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------

export const adminLogin = (data: LoginRequest) =>
  request<LoginResponse>("/api/admin/auth/login", { method: "POST", body: JSON.stringify(data) });

// ---------------------------------------------------------------------------
// Admin — Services
// ---------------------------------------------------------------------------

export const adminGetServices = (token: string) => request<AdminService[]>("/api/admin/services", { token, cache: "no-store" });
export const adminGetService = (token: string, id: number) => request<AdminService>(`/api/admin/services/${id}`, { token, cache: "no-store" });
export const adminCreateService = async (token: string, data: ServiceWriteRequest) => {
  const result = await request<AdminService>("/api/admin/services", { method: "POST", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "services");
  return result;
};
export const adminUpdateService = async (token: string, id: number, data: ServiceWriteRequest) => {
  const result = await request<AdminService>(`/api/admin/services/${id}`, { method: "PUT", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "services");
  return result;
};
export const adminDeleteService = async (token: string, id: number) => {
  const result = await request<void>(`/api/admin/services/${id}`, { method: "DELETE", token });
  triggerRevalidate(token, "services");
  return result;
};

// ---------------------------------------------------------------------------
// Admin — Categories
// ---------------------------------------------------------------------------

export const adminGetCategories = (token: string) => request<AdminCategory[]>("/api/admin/categories", { token, cache: "no-store" });
export const adminGetCategory = (token: string, id: number) => request<AdminCategory>(`/api/admin/categories/${id}`, { token, cache: "no-store" });
export const adminCreateCategory = async (token: string, data: CategoryWriteRequest) => {
  const result = await request<AdminCategory>("/api/admin/categories", { method: "POST", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "categories");
  return result;
};
export const adminUpdateCategory = async (token: string, id: number, data: CategoryWriteRequest) => {
  const result = await request<AdminCategory>(`/api/admin/categories/${id}`, { method: "PUT", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "categories");
  return result;
};
export const adminDeleteCategory = async (token: string, id: number) => {
  const result = await request<void>(`/api/admin/categories/${id}`, { method: "DELETE", token });
  triggerRevalidate(token, "categories");
  return result;
};

// ---------------------------------------------------------------------------
// Admin — Products
// ---------------------------------------------------------------------------

export const adminGetProducts = (token: string, params: { page?: number; size?: number; categoryId?: number } = {}) => {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page ?? 0));
  qs.set("size", String(params.size ?? 20));
  if (params.categoryId) qs.set("categoryId", String(params.categoryId));
  return request<Paginated<AdminProduct>>(`/api/admin/products?${qs.toString()}`, { token, cache: "no-store" });
};
export const adminGetProduct = (token: string, id: number) => request<AdminProduct>(`/api/admin/products/${id}`, { token, cache: "no-store" });
export const adminCreateProduct = async (token: string, data: ProductWriteRequest) => {
  const result = await request<AdminProduct>("/api/admin/products", { method: "POST", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "products");
  return result;
};
export const adminUpdateProduct = async (token: string, id: number, data: ProductWriteRequest) => {
  const result = await request<AdminProduct>(`/api/admin/products/${id}`, { method: "PUT", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "products");
  return result;
};
export const adminDeleteProduct = async (token: string, id: number) => {
  const result = await request<void>(`/api/admin/products/${id}`, { method: "DELETE", token });
  triggerRevalidate(token, "products");
  return result;
};

// ---------------------------------------------------------------------------
// Admin — Contact messages
// ---------------------------------------------------------------------------

export const adminGetMessages = (token: string, params: { status?: "NEW" | "READ"; page?: number; size?: number } = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  qs.set("page", String(params.page ?? 0));
  qs.set("size", String(params.size ?? 20));
  return request<Paginated<ContactMessage>>(`/api/admin/contact-messages?${qs.toString()}`, { token, cache: "no-store" });
};
export const adminGetMessage = (token: string, id: number) =>
  request<ContactMessage>(`/api/admin/contact-messages/${id}`, { token, cache: "no-store" });
export const adminUpdateMessageStatus = (token: string, id: number, status: "NEW" | "READ") =>
  request<ContactMessage>(`/api/admin/contact-messages/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
export const adminDeleteMessage = (token: string, id: number) =>
  request<void>(`/api/admin/contact-messages/${id}`, { method: "DELETE", token });

// ---------------------------------------------------------------------------
// Admin — Site settings
// ---------------------------------------------------------------------------

export const adminGetSiteSettings = (token: string) => request<SiteSettings>("/api/admin/site-settings", { token, cache: "no-store" });
export const adminUpdateSiteSettings = async (token: string, data: SiteSettings) => {
  const result = await request<SiteSettings>("/api/admin/site-settings", { method: "PUT", token, body: JSON.stringify(data) });
  triggerRevalidate(token, "site-settings");
  return result;
};
