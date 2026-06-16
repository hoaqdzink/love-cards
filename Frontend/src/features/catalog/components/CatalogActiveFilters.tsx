import { X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import type { ColorTag, EventType, PriceRange, TemplateSort } from '@/features/catalog/types';
import { SORT_OPTIONS, PRICE_RANGE_OPTIONS } from '@/features/catalog/utils/catalogLabels';

type ActiveFilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type CatalogActiveFiltersProps = {
  totalElements: number;
  searchQuery: string;
  selectedEvents: EventType[];
  selectedColors: ColorTag[];
  priceRange?: PriceRange;
  sort: TemplateSort;
  onRemoveEvent: (eventType: EventType) => void;
  onRemoveColor: (color: ColorTag) => void;
  onRemovePriceRange: () => void;
  onRemoveSort: () => void;
  onRemoveSearch: () => void;
  onResetAll: () => void;
};

export function CatalogActiveFilters({
  totalElements,
  searchQuery,
  selectedEvents,
  selectedColors,
  priceRange,
  sort,
  onRemoveEvent,
  onRemoveColor,
  onRemovePriceRange,
  onRemoveSort,
  onRemoveSearch,
  onResetAll,
}: CatalogActiveFiltersProps) {
  const { t } = useTranslation();

  const chips: ActiveFilterChip[] = [];

  if (searchQuery.trim()) {
    chips.push({
      key: `q:${searchQuery}`,
      label: `"${searchQuery.trim()}"`,
      onRemove: onRemoveSearch,
    });
  }

  selectedEvents.forEach((eventType) => {
    chips.push({
      key: `event:${eventType}`,
      label: t(`catalog.filters.events.${eventType}`),
      onRemove: () => onRemoveEvent(eventType),
    });
  });

  selectedColors.forEach((color) => {
    chips.push({
      key: `color:${color}`,
      label: t(`catalog.filters.colors.${color}`),
      onRemove: () => onRemoveColor(color),
    });
  });

  if (priceRange) {
    const priceOption = PRICE_RANGE_OPTIONS.find((option) => option.value === priceRange);
    chips.push({
      key: `price:${priceRange}`,
      label: priceOption ? t(priceOption.labelKey) : priceRange,
      onRemove: onRemovePriceRange,
    });
  }

  if (sort !== 'popular') {
    const sortLabel = SORT_OPTIONS.find((option) => option.value === sort);
    chips.push({
      key: `sort:${sort}`,
      label: sortLabel ? t(sortLabel.labelKey) : sort,
      onRemove: onRemoveSort,
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-medium text-slate">
        {t('catalog.resultTotal', { total: totalElements.toLocaleString('vi-VN') })}
      </p>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate/50">{t('catalog.activeFilters')}</span>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1 rounded-full border border-lightrose bg-white px-3 py-1 text-xs font-medium text-slate transition-colors hover:border-rose hover:text-rose"
            >
              {chip.label}
              <X size={12} weight="bold" aria-hidden />
              <span className="sr-only">{t('catalog.removeFilter')}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-medium text-rose hover:text-rose/80"
          >
            {t('catalog.filters.reset')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
