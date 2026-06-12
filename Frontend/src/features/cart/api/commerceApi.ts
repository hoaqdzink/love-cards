import type { ApiResponse } from '@/features/cart/types';
import type { CreateOrderItem, HostingPlan, Order } from '@/features/cart/types';
import { api } from '@/shared/services/api';
import { getMockUserHeaders } from '@/shared/lib/mockUser';

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

export const commerceApi = {
  async getHostingPlans(): Promise<HostingPlan[]> {
    const response = await api.get<ApiResponse<HostingPlan[]>>('/hosting-plans');
    return unwrap(response);
  },

  async createOrder(items: CreateOrderItem[]): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      '/orders',
      { items },
      getMockUserHeaders(),
    );
    return unwrap(response);
  },

  async getOrder(orderCode: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(
      `/orders/${orderCode}`,
      undefined,
      getMockUserHeaders(),
    );
    return unwrap(response);
  },
};
