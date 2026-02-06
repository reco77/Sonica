import type { OrderStatus } from "@sonica/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ---------------------------------------------------------------------------
// Auth token management
// ---------------------------------------------------------------------------

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("admin_token");
  }
  return authToken;
}

// ---------------------------------------------------------------------------
// Generic fetch wrapper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `API error ${res.status}: ${res.statusText}${body ? ` - ${body}` : ""}`,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: ApiPagination;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  lowStockItems: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  tagline: string;
  description: string;
  category: string;
  specs: any;
  connectivity: any;
  batteryLife: any;
  compatibility: string[];
  releaseDate: string;
  featured: boolean;
  active: boolean;
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  variants: ApiVariant[];
  images: ApiImage[];
}

export interface ApiVariant {
  id: string;
  productId: string;
  color: string;
  colorHex: string;
  edition: string | null;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
}

export interface ApiImage {
  id: string;
  url: string;
  type: string;
  sortOrder: number;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: any;
  trackingNumber: string | null;
  carrier: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
  user?: { id: string; name: string; email: string };
}

export interface ApiOrderItem {
  id: string;
  variantId: string;
  productName: string;
  variantColor: string;
  quantity: number;
  priceAtPurchase: number;
  variant?: {
    product?: {
      slug: string;
      images: ApiImage[];
    };
  };
}

export interface InventoryItem {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  colorHex: string;
  edition: string | null;
  sku: string;
  stock: number;
  price: number;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export interface ProductListParams {
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(
  params?: ProductListParams,
): Promise<PaginatedResponse<ApiProduct>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.brand) searchParams.set("brand", params.brand);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<ApiProduct>>(
    `/api/products${qs ? `?${qs}` : ""}`,
  );
}

export async function getProduct(
  slug: string,
): Promise<{ data: ApiProduct }> {
  return apiFetch<{ data: ApiProduct }>(`/api/products/${slug}`);
}

export async function createProduct(
  data: Record<string, unknown>,
): Promise<{ data: ApiProduct }> {
  return apiFetch<{ data: ApiProduct }>("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: Record<string, unknown>,
): Promise<{ data: ApiProduct }> {
  return apiFetch<{ data: ApiProduct }>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface OrderListParams {
  status?: string;
  page?: number;
  limit?: number;
}

export async function getOrders(
  params?: OrderListParams,
): Promise<PaginatedResponse<ApiOrder>> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<ApiOrder>>(
    `/api/orders${qs ? `?${qs}` : ""}`,
  );
}

export async function getOrder(
  id: string,
): Promise<{ data: ApiOrder }> {
  return apiFetch<{ data: ApiOrder }>(`/api/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: { trackingNumber?: string; carrier?: string; notes?: string },
): Promise<{ data: ApiOrder }> {
  return apiFetch<{ data: ApiOrder }>(`/api/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, ...extra }),
  });
}

// ---------------------------------------------------------------------------
// Dashboard Stats (aggregated from products + orders)
// ---------------------------------------------------------------------------

export async function getStats(): Promise<DashboardStats> {
  const [productsRes, ordersRes] = await Promise.all([
    getProducts({ limit: 50 }),
    getOrders({ limit: 50 }).catch(
      () =>
        ({
          data: [],
          pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
        }) as PaginatedResponse<ApiOrder>,
    ),
  ]);

  const products = productsRes.data || [];
  const orders = ordersRes.data || [];

  let lowStockItems = 0;
  for (const product of products) {
    if (product.variants) {
      for (const variant of product.variants) {
        if (variant.stock < 5) lowStockItems++;
      }
    }
  }

  const totalRevenue = orders.reduce(
    (sum: number, order: ApiOrder) => sum + (order.total || 0),
    0,
  );

  return {
    totalRevenue,
    totalOrders: ordersRes.pagination.total,
    activeProducts: productsRes.pagination.total,
    lowStockItems,
  };
}

// ---------------------------------------------------------------------------
// Inventory (aggregated from products with variants)
// ---------------------------------------------------------------------------

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await getProducts({ limit: 50 });
  const items: InventoryItem[] = [];

  for (const product of res.data || []) {
    if (product.variants) {
      for (const variant of product.variants) {
        items.push({
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          color: variant.color,
          colorHex: variant.colorHex,
          edition: variant.edition,
          sku: variant.sku,
          stock: variant.stock,
          price: variant.price,
        });
      }
    }
  }

  return items;
}

export async function updateStock(
  productId: string,
  _variantId: string,
  stock: number,
): Promise<void> {
  // Update via the product update endpoint
  // Note: The current API only supports top-level product field updates.
  // A dedicated inventory/variant endpoint would be needed for full support.
  await updateProduct(productId, { stock });
}
