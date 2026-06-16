import type { ColorTag, EventType, PriceRange, TemplateSort } from '@/features/catalog/types';

export const EVENT_TYPE_OPTIONS: Array<{ value: EventType; labelKey: string }> = [
  { value: 'wedding', labelKey: 'catalog.filters.events.wedding' },
  { value: 'birthday', labelKey: 'catalog.filters.events.birthday' },
  { value: 'party', labelKey: 'catalog.filters.events.party' },
  { value: 'other', labelKey: 'catalog.filters.events.other' },
];

export const COLOR_OPTIONS: Array<{ value: ColorTag; labelKey: string; className: string }> = [
  { value: 'pink', labelKey: 'catalog.filters.colors.pink', className: 'bg-pink-300' },
  { value: 'white', labelKey: 'catalog.filters.colors.white', className: 'bg-white' },
  { value: 'gold', labelKey: 'catalog.filters.colors.gold', className: 'bg-yellow-400' },
  { value: 'blue', labelKey: 'catalog.filters.colors.blue', className: 'bg-blue-400' },
  { value: 'purple', labelKey: 'catalog.filters.colors.purple', className: 'bg-purple-400' },
  { value: 'green', labelKey: 'catalog.filters.colors.green', className: 'bg-green-400' },
  { value: 'red', labelKey: 'catalog.filters.colors.red', className: 'bg-red-500' },
];

export const SORT_OPTIONS: Array<{ value: TemplateSort; labelKey: string }> = [
  { value: 'popular', labelKey: 'catalog.sort.popular' },
  { value: 'newest', labelKey: 'catalog.sort.newest' },
  { value: 'price_asc', labelKey: 'catalog.sort.priceAsc' },
  { value: 'price_desc', labelKey: 'catalog.sort.priceDesc' },
];

export const PRICE_RANGE_OPTIONS: Array<{ value: PriceRange; labelKey: string }> = [
  { value: 'free', labelKey: 'catalog.price.free' },
  { value: 'under_50k', labelKey: 'catalog.price.under50k' },
  { value: '50k_100k', labelKey: 'catalog.price.range50k100k' },
  { value: 'over_100k', labelKey: 'catalog.price.over100k' },
];

export const NEW_TEMPLATE_DAYS = 30;

export function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function isTemplateNew(createdAt: string): boolean {
  const created = new Date(createdAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_TEMPLATE_DAYS);
  return created >= cutoff;
}

export function formatViewCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toLocaleString('vi-VN');
}
