/**
 * Hydrate giỏ cookie (chỉ templateId[]) thành dòng có tên, giá, ảnh từ Template API.
 * Dùng trên CartPage và CheckoutPage.
 */
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useCartStore } from '@/app/store/useCartStore';
import { catalogApi } from '@/features/catalog/api/catalogApi';
import type { EnrichedCartLine } from '@/features/cart/types';

export function useEnrichedCart() {
  const items = useCartStore((state) => state.items);

  // Mỗi templateId trong giỏ → một query song song (Promise.all qua useQueries)
  const queries = useQueries({
    queries: items.map((templateId) => ({
      queryKey: ['template', 'by-id', templateId],
      queryFn: () => catalogApi.getTemplateById(templateId),
      staleTime: 60_000,
    })),
  });

  const lines: EnrichedCartLine[] = useMemo(
    () =>
      items.map((templateId, index) => ({
        templateId,
        template: queries[index]?.data ?? null,
      })),
    [items, queries],
  );

  const isLoading = queries.some((q) => q.isLoading);
  const hasError = queries.some((q) => q.isError);

  // Tạm tính chỉ gồm giá mẫu — hosting cộng ở checkout
  const subtotal = lines.reduce((sum, line) => sum + (line.template?.price ?? 0), 0);

  return { lines, isLoading, hasError, subtotal, itemCount: items.length };
}
