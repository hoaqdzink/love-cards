/**
 * API client Order Service — hosting plans, tạo đơn, xem đơn.
 * Gọi qua gateway `/api/v1`; cart/order yêu cầu header `X-User-Id` (mock Phase 2).
 */
import type { ApiResponse } from '@/features/cart/types';
import type { CreateOrderItem, HostingPlan, Order } from '@/features/cart/types';
import { api } from '@/shared/services/api';
import { getMockUserHeaders } from '@/shared/lib/mockUser';

/** Trích `data` từ envelope AppResponse — giống catalogApi. */
function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

export const commerceApi = {
  /** Danh sách gói hosting active (public, không cần user header). */
  async getHostingPlans(): Promise<HostingPlan[]> {
    const response = await api.get<ApiResponse<HostingPlan[]>>('/hosting-plans');
    return unwrap(response);
  },

  /**
   * Tạo đơn CREATED — body mỗi item: templateId + hostingPlanId (Q07).
   * Không xóa cookie cart phía FE sau success (Phase 2.5 mới clear sau PAID).
   */
  async createOrder(items: CreateOrderItem[]): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      '/orders',
      { items },
      getMockUserHeaders(),
    );
    return unwrap(response);
  },

  /** Chi tiết đơn theo mã — kiểm tra ownership qua X-User-Id. */
  async getOrder(orderCode: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(
      `/orders/${orderCode}`,
      undefined,
      getMockUserHeaders(),
    );
    return unwrap(response);
  },
};
