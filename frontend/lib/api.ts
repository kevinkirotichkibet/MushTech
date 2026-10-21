const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
// On the server (inside Docker) call the API via its service name; in the browser use the public URL.
const API = typeof window === 'undefined' ? process.env.API_INTERNAL_URL || PUBLIC_API : PUBLIC_API;

export type Product = {
  _id: string; name: string; variety: string; description?: string;
  pricePerKg: number; stockKg: number; imageUrl?: string; active?: boolean; comingSoon?: boolean;
};
export type User = { id: string; name: string; email: string; role: 'customer' | 'admin' };
export type AuthResult = { accessToken: string; user: User };
export type Order = {
  _id: string; customerName: string; phone: string; address: string;
  items: { name: string; qtyKg: number; unitPrice: number }[];
  total: number; status: string; createdAt: string;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function request<T>(path: string, o: { method?: string; body?: unknown; token?: string | null } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: o.method || 'GET',
      headers: {
        ...(o.body ? { 'Content-Type': 'application/json' } : {}),
        ...(o.token ? { Authorization: `Bearer ${o.token}` } : {}),
      },
      body: o.body ? JSON.stringify(o.body) : undefined,
      cache: 'no-store',
    });
  } catch (e) {
    // let Next.js's own control-flow errors (dynamic rendering) pass through untouched
    if ((e as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') throw e;
    throw new ApiError('Cannot reach the server. If it was idle, wait a minute and try again.', 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new ApiError(msg || 'Request failed', res.status);
  }
  return data as T;
}

// public
export const getProducts = () => request<Product[]>('/products');
export const getProduct = (id: string) => request<Product>(`/products/${id}`);
// auth
export const register = (body: { name: string; email: string; password: string }) =>
  request<AuthResult>('/auth/register', { method: 'POST', body });
export const login = (body: { email: string; password: string }) =>
  request<AuthResult>('/auth/login', { method: 'POST', body });
export const me = (token: string) => request<User>('/auth/me', { token });
// customer
export const placeOrder = (body: unknown, token: string) => request<Order>('/orders', { method: 'POST', body, token });
export const myOrders = (token: string) => request<Order[]>('/orders/mine', { token });
// admin
export const allOrders = (token: string) => request<Order[]>('/orders', { token });
export const setOrderStatus = (id: string, status: string, token: string) =>
  request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: { status }, token });
export const adminProducts = (token: string) => request<Product[]>('/products/admin/all', { token });
export const createProduct = (body: unknown, token: string) => request<Product>('/products', { method: 'POST', body, token });
export const updateProduct = (id: string, body: unknown, token: string) =>
  request<Product>(`/products/${id}`, { method: 'PATCH', body, token });

// admin dashboard
export type AdminStats = {
  totals: { orders: number; ordersToday: number; pending: number; revenue: number; revenueToday: number; customers: number };
  byStatus: Record<string, number>;
  daily: { date: string; orders: number; revenue: number }[];
  top: { name: string; kg: number; revenue: number }[];
  stock: { name: string; stockKg: number; comingSoon?: boolean }[];
  recent: { _id: string; customerName: string; total: number; status: string; createdAt: string }[];
};
export type Customer = { id: string; name: string; email: string; createdAt: string; orders: number; spent: number };
export const adminStats = (token: string) => request<AdminStats>('/admin/stats', { token });
export const adminCustomers = (token: string) => request<Customer[]>('/admin/customers', { token });
