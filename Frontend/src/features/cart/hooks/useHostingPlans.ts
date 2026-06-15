/**
 * TanStack Query — cache danh sách gói hosting từ Order Service.
 * Dùng trên CheckoutPage để chọn plan theo từng mẫu.
 */
import { useQuery } from '@tanstack/react-query';
import { commerceApi } from '@/features/cart/api/commerceApi';

export function useHostingPlans() {
  return useQuery({
    queryKey: ['hosting-plans'],
    queryFn: () => commerceApi.getHostingPlans(),
    staleTime: 5 * 60_000,
  });
}
