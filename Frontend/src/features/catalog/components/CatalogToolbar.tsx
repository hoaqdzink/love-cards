import { useTranslation } from 'react-i18next';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { ColorTag, EventType, PriceRange, TemplateSort } from '@/features/catalog/types';
import {
  COLOR_OPTIONS,
  EVENT_TYPE_OPTIONS,
  PRICE_RANGE_OPTIONS,
  SORT_OPTIONS,
} from '@/features/catalog/utils/catalogLabels';
import { FilterDropdown } from './FilterDropdown';

type CatalogToolbarProps = {
  searchInput: string;
  onSearchChange: (value: string) => void;
  selectedEvents: EventType[];
  selectedColors: ColorTag[];
  priceRange?: PriceRange;
  sort: TemplateSort;
  onToggleEvent: (eventType: EventType) => void;
  onToggleColor: (color: ColorTag) => void;
  onPriceRangeChange: (priceRange?: PriceRange) => void;
  onSortChange: (sort: TemplateSort) => void;
};

export function CatalogToolbar({
  searchInput,
  onSearchChange,
  selectedEvents,
  selectedColors,
  priceRange,
  sort,
  onToggleEvent,
  onToggleColor,
  onPriceRangeChange,
  onSortChange,
}: CatalogToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-[4.5rem] z-40 -mx-4 border-b border-lightrose/80 bg-cream/95 px-4 py-3 backdrop-blur-md sm:top-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">{t('catalog.search.label')}</span>
          <MagnifyingGlass
            size={20}
            weight="bold"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate/40"
            aria-hidden
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('catalog.search.placeholder')}
            className="w-full rounded-2xl border border-lightrose bg-white py-3 pl-11 pr-4 text-sm text-slate outline-none shadow-card focus:border-rose focus:ring-2 focus:ring-rose/20"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterDropdown
            label={t('catalog.filters.eventType')}
            activeCount={selectedEvents.length}
          >
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPE_OPTIONS.map((option) => {
                const active = selectedEvents.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggleEvent(option.value)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      active ? 'bg-rose text-white' : 'bg-cream text-slate hover:bg-lightrose/60'
                    }`}
                    aria-pressed={active}
                  >
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
          </FilterDropdown>

          <FilterDropdown label={t('catalog.filters.color')} activeCount={selectedColors.length}>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => {
                const active = selectedColors.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggleColor(option.value)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active ? 'border-rose text-rose' : 'border-lightrose text-slate hover:bg-cream'
                    }`}
                    aria-pressed={active}
                  >
                    <span className={`h-3.5 w-3.5 rounded-full border border-slate/10 ${option.className}`} />
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
          </FilterDropdown>

          <FilterDropdown label={t('catalog.price.label')} activeCount={priceRange ? 1 : 0}>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onPriceRangeChange(undefined)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  !priceRange ? 'bg-rose/10 font-medium text-rose' : 'text-slate hover:bg-cream'
                }`}
              >
                {t('catalog.price.all')}
              </button>
              {PRICE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPriceRangeChange(option.value)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    priceRange === option.value
                      ? 'bg-rose/10 font-medium text-rose'
                      : 'text-slate hover:bg-cream'
                  }`}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          </FilterDropdown>

          <FilterDropdown label={t('catalog.sort.label')} activeCount={sort !== 'popular' ? 1 : 0}>
            <div className="space-y-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSortChange(option.value)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    sort === option.value
                      ? 'bg-rose/10 font-medium text-rose'
                      : 'text-slate hover:bg-cream'
                  }`}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          </FilterDropdown>
        </div>
      </div>
    </div>
  );
}
