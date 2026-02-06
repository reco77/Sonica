const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | string[] | undefined>;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Product types
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  variants: ProductVariant[];
  specs: Record<string, string | number | boolean>;
  compatibility: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  price?: number;
  inStock: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  connectivity?: string;
  features?: string[];
  sort?: string;
  page?: string;
  search?: string;
}

// Cart types
export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface CartItemResponse {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: Product;
}

// Order types
export interface Order {
  id: string;
  status: string;
  items: CartItemResponse[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
}

// API functions
export const api = {
  products: {
    list: (filters?: ProductFilters) =>
      fetchApi<ProductsResponse>("/products", {
        params: filters as Record<string, string>,
        next: { revalidate: 60 },
      }),

    getBySlug: (slug: string) =>
      fetchApi<Product>(`/products/${slug}`, {
        next: { revalidate: 60 },
      }),

    search: (query: string) =>
      fetchApi<ProductsResponse>("/products/search", {
        params: { q: query },
      }),

    getFeatured: () =>
      fetchApi<Product[]>("/products/featured", {
        next: { revalidate: 300 },
      }),
  },

  cart: {
    get: () => fetchApi<CartResponse>("/cart"),

    addItem: (productId: string, variantId?: string, quantity = 1) =>
      fetchApi<CartResponse>("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, variantId, quantity }),
      }),

    updateItem: (itemId: string, quantity: number) =>
      fetchApi<CartResponse>(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),

    removeItem: (itemId: string) =>
      fetchApi<CartResponse>(`/cart/items/${itemId}`, {
        method: "DELETE",
      }),
  },

  orders: {
    create: (cartId: string) =>
      fetchApi<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({ cartId }),
      }),

    get: (id: string) => fetchApi<Order>(`/orders/${id}`),
  },

  checkout: {
    createSession: (cartId: string) =>
      fetchApi<{ sessionId: string; url: string }>("/checkout/session", {
        method: "POST",
        body: JSON.stringify({ cartId }),
      }),
  },
};
