import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layouts/MainLayout';
import { useDebounce, useInfiniteScroll } from '@/shared/hooks';
import {
  CatalogActiveFilters,
  CatalogState,
  CatalogToolbar,
  TemplateCard,
  TemplateQuickPreviewModal,
} from '@/features/catalog/components';
import { useTemplatesInfinite } from '@/features/catalog/hooks';
import type { ColorTag, EventType, PriceRange, TemplateListItem, TemplateSort } from '@/features/catalog/types';

const DEFAULT_SORT: TemplateSort = 'popular';
const PAGE_SIZE = 30;
const EVENT_VALUES: EventType[] = ['wedding', 'birthday', 'party', 'other'];
const COLOR_VALUES: ColorTag[] = ['pink', 'white', 'gold', 'blue', 'purple', 'green', 'red'];
const SORT_VALUES: TemplateSort[] = ['popular', 'newest', 'price_asc', 'price_desc'];
const PRICE_VALUES: PriceRange[] = ['free', 'under_50k', '50k_100k', 'over_100k'];

export function CatalogPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateListItem | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  const selectedEvents = useMemo(() => parseList(searchParams.get('event_type'), EVENT_VALUES), [searchParams]);
  const selectedColors = useMemo(() => parseList(searchParams.get('colors'), COLOR_VALUES), [searchParams]);
  const priceRange = parseValue(searchParams.get('price'), PRICE_VALUES);
  const sort = parseValue(searchParams.get('sort'), SORT_VALUES) ?? DEFAULT_SORT;

  useEffect(() => {
    updateParams(setSearchParams, { q: debouncedSearch });
  }, [debouncedSearch, setSearchParams]);

  const filter = useMemo(
    () => ({
      eventType: selectedEvents,
      colors: selectedColors,
      priceRange,
      sort,
      size: PAGE_SIZE,
      q: debouncedSearch,
    }),
    [selectedEvents, selectedColors, priceRange, sort, debouncedSearch],
  );

  const templatesQuery = useTemplatesInfinite(filter);
  const templates = templatesQuery.data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = templatesQuery.data?.pages[0]?.totalElements ?? 0;

  const loadMore = useCallback(() => {
    if (templatesQuery.hasNextPage && !templatesQuery.isFetchingNextPage) {
      void templatesQuery.fetchNextPage();
    }
  }, [templatesQuery]);

  const sentinelRef = useInfiniteScroll({
    enabled: templatesQuery.isSuccess && templatesQuery.hasNextPage,
    onLoadMore: loadMore,
  });

  function toggleEvent(eventType: EventType) {
    const next = toggleValue(selectedEvents, eventType);
    updateParams(setSearchParams, { event_type: next.join(',') });
  }

  function toggleColor(color: ColorTag) {
    const next = toggleValue(selectedColors, color);
    updateParams(setSearchParams, { colors: next.join(',') });
  }

  function changeSort(nextSort: TemplateSort) {
    updateParams(setSearchParams, { sort: nextSort === DEFAULT_SORT ? '' : nextSort });
  }

  function changePriceRange(nextPriceRange?: PriceRange) {
    updateParams(setSearchParams, { price: nextPriceRange ?? '' });
  }

  function resetFilters() {
    setSearchInput('');
    setSearchParams({});
  }

  function handleUseTemplate(template: TemplateListItem) {
    setPreviewTemplate(null);
    navigate(`/mau-thiep/${template.slug}`);
  }

  return (
    <MainLayout>
      <section className="bg-cream pb-20 pt-32">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-gold">{t('catalog.eyebrow')}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-slate sm:text-5xl">{t('catalog.title')}</h1>
            <p className="mt-4 text-slate/60">{t('catalog.description')}</p>
          </div>

          <CatalogToolbar
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            selectedEvents={selectedEvents}
            selectedColors={selectedColors}
            priceRange={priceRange}
            sort={sort}
            onToggleEvent={toggleEvent}
            onToggleColor={toggleColor}
            onPriceRangeChange={changePriceRange}
            onSortChange={changeSort}
          />

          <div className="mt-6 space-y-6">
            {templatesQuery.isSuccess ? (
              <CatalogActiveFilters
                totalElements={totalElements}
                searchQuery={debouncedSearch}
                selectedEvents={selectedEvents}
                selectedColors={selectedColors}
                priceRange={priceRange}
                sort={sort}
                onRemoveEvent={toggleEvent}
                onRemoveColor={toggleColor}
                onRemovePriceRange={() => changePriceRange(undefined)}
                onRemoveSort={() => changeSort(DEFAULT_SORT)}
                onRemoveSearch={() => setSearchInput('')}
                onResetAll={resetFilters}
              />
            ) : null}

            {templatesQuery.isLoading ? <CatalogState type="loading" /> : null}
            {templatesQuery.isError ? (
              <CatalogState type="error" onRetry={() => void templatesQuery.refetch()} />
            ) : null}

            {templatesQuery.isSuccess && templates.length === 0 ? <CatalogState type="empty" /> : null}

            {templatesQuery.isSuccess && templates.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-5">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onPreviewClick={setPreviewTemplate}
                      onUseTemplateClick={handleUseTemplate}
                    />
                  ))}
                </div>

                <div ref={sentinelRef} className="flex min-h-12 items-center justify-center py-4">
                  {templatesQuery.isFetchingNextPage ? (
                    <p className="text-sm text-slate/60">{t('catalog.loadingMore')}</p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <TemplateQuickPreviewModal
        template={previewTemplate}
        open={previewTemplate != null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
      />
    </MainLayout>
  );
}

function parseList<T extends string>(value: string | null, allowed: T[]): T[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
}

function parseValue<T extends string>(value: string | null, allowed: T[]): T | undefined {
  return value && allowed.includes(value as T) ? (value as T) : undefined;
}

function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function updateParams(
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  patch: Record<string, string>,
) {
  setSearchParams((current) => {
    const next = new URLSearchParams(current);
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    next.delete('page');
    return next;
  });
}
