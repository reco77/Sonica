import type { Product, Order, Review, OrderStatus } from "@sonica/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// ---------------------------------------------------------------------------
// Generic fetch wrapper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `API error ${res.status}: ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalRevenue: number;
  ordersToday: number;
  activeProducts: number;
  lowStockItems: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/admin/dashboard/stats");
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export interface ProductListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchProducts(
  params?: ProductListParams
): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<Product>>(
    `/admin/products${qs ? `?${qs}` : ""}`
  );
}

export async function fetchProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}`);
}

export async function createProduct(
  data: Omit<Product, "id" | "averageRating" | "reviewCount">
): Promise<Product> {
  return apiFetch<Product>("/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/admin/products/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface OrderListParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export async function fetchOrders(
  params?: OrderListParams
): Promise<PaginatedResponse<Order>> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<Order>>(
    `/admin/orders${qs ? `?${qs}` : ""}`
  );
}

export async function fetchOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/admin/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  return apiFetch<Order>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function fetchReviews(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Review>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<Review>>(
    `/admin/reviews${qs ? `?${qs}` : ""}`
  );
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export interface InventoryItem {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  edition?: string;
  sku: string;
  stock: number;
  price: number;
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  return apiFetch<InventoryItem[]>("/admin/inventory");
}

export async function updateStock(
  productId: string,
  variantId: string,
  stock: number
): Promise<void> {
  await apiFetch<void>(`/admin/inventory/${productId}/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export async function fetchCustomers(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Customer>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<Customer>>(
    `/admin/customers${qs ? `?${qs}` : ""}`
  );
}
