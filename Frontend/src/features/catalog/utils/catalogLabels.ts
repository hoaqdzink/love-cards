import type { ColorTag, EventType, TemplateSort } from '@/features/catalog/types';

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

export function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}
