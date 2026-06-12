import { useQuery } from '@tanstack/react-query';
import { commerceApi } from '@/features/cart/api/commerceApi';

export function useHostingPlans() {
  return useQuery({
    queryKey: ['hosting-plans'],
    queryFn: () => commerceApi.getHostingPlans(),
    staleTime: 5 * 60_000,
  });
}
