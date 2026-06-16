import type { TemplateListItem } from '@/features/catalog/types';

const CACHE_KEY = 'lc_featured_templates_v1';
const CACHE_TS_KEY = 'lc_featured_templates_v1_ts';
const MAX_AGE_MS = 15 * 60 * 1000;

export function readFeaturedTemplatesCache(): TemplateListItem[] | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const ts = Number(sessionStorage.getItem(CACHE_TS_KEY));
    if (!ts || Date.now() - ts > MAX_AGE_MS) return undefined;

    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as TemplateListItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function writeFeaturedTemplatesCache(templates: TemplateListItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(templates));
    sessionStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch {
    // sessionStorage full or unavailable
  }
}
