import type { Product, Order, DashboardData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    const payload = await response.json();
    if (Array.isArray(payload)) {
      return payload;
    }
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload.products)) {
      return payload.products;
    }
    return [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  },
};

export const orderService = {
  create: async (order: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return response.json();
  },

  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    return response.json();
  },

  getById: async (id: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    return response.json();
  },

  updateStatus: async (id: string, orderStatus: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus }),
    });
    return response.json();
  },

  verifyPayment: async (id: string, verified: boolean): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified }),
    });
    return response.json();
  },
};

export const adminService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getDashboard: async (): Promise<DashboardData> => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
    return response.json();
  },
};
