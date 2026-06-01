import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/features/catalog/api/catalogApi';
import type { TemplateFilter } from '@/features/catalog/types';

const CATALOG_SESSION_KEY = 'lc_catalog_session';

function getCatalogSessionId(): string {
  const existing = window.localStorage.getItem(CATALOG_SESSION_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  window.localStorage.setItem(CATALOG_SESSION_KEY, generated);
  return generated;
}

export function useTemplates(filter: TemplateFilter) {
  return useQuery({
    queryKey: ['templates', filter],
    queryFn: () => catalogApi.getTemplates(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedTemplates() {
  return useQuery({
    queryKey: ['templates', 'featured'],
    queryFn: catalogApi.getFeaturedTemplates,
    staleTime: 15 * 60 * 1000,
  });
}

export function useTrendingTemplates() {
  return useQuery({
    queryKey: ['templates', 'trending'],
    queryFn: catalogApi.getTrendingTemplates,
    staleTime: 15 * 60 * 1000,
  });
}

export function useTemplateDetail(slug?: string) {
  const sessionId = useMemo(() => getCatalogSessionId(), []);

  return useQuery({
    queryKey: ['templates', 'detail', slug],
    queryFn: () => catalogApi.getTemplateDetail(slug ?? '', sessionId),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTemplateCategories() {
  return useQuery({
    queryKey: ['templates', 'categories'],
    queryFn: catalogApi.getCategories,
    staleTime: 30 * 60 * 1000,
  });
}

export function useMusic(genre?: string) {
  return useQuery({
    queryKey: ['music', genre],
    queryFn: () => catalogApi.getMusic(genre),
    staleTime: 15 * 60 * 1000,
  });
}
