import { useMemo } from 'react';
import { useTemplateCategories } from '@/features/catalog/hooks';

export function useTotalTemplateCount(): number {
  const categoriesQuery = useTemplateCategories();

  return useMemo(() => {
    const categories = categoriesQuery.data ?? [];
    return categories.reduce((sum, category) => sum + category.count, 0);
  }, [categoriesQuery.data]);
}
