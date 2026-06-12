import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layouts/MainLayout';
import { useAddToCart } from '@/features/cart/hooks';
import { useDebounce } from '@/shared/hooks';
import { CatalogPagination, CatalogState, FilterPanel, TemplateCard } from '@/features/catalog/components';
import { useTemplates } from '@/features/catalog/hooks';
import type { ColorTag, EventType, TemplateFilter, TemplateSort } from '@/features/catalog/types';

const DEFAULT_SORT: TemplateSort = 'popular';
const DEFAULT_SIZE = 12;
const EVENT_VALUES: EventType[] = ['wedding', 'birthday', 'party', 'other'];
const COLOR_VALUES: ColorTag[] = ['pink', 'white', 'gold', 'blue', 'purple', 'green', 'red'];
const SORT_VALUES: TemplateSort[] = ['popular', 'newest', 'price_asc', 'price_desc'];

export function CatalogPage() {
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const debouncedSearch = useDebounce(searchInput, 300);

  const selectedEvents = useMemo(() => parseList(searchParams.get('event_type'), EVENT_VALUES), [searchParams]);
  const selectedColors = useMemo(() => parseList(searchParams.get('colors'), COLOR_VALUES), [searchParams]);
  const sort = parseValue(searchParams.get('sort'), SORT_VALUES) ?? DEFAULT_SORT;
  const page = Math.max(Number(searchParams.get('page') ?? '0'), 0);

  useEffect(() => {
    updateParams(setSearchParams, { q: debouncedSearch, page: '0' });
  }, [debouncedSearch, setSearchParams]);

  const filter: TemplateFilter = {
    eventType: selectedEvents,
    colors: selectedColors,
    sort,
    page,
    size: DEFAULT_SIZE,
    q: debouncedSearch,
  };
  const templatesQuery = useTemplates(filter);
  const templates = templatesQuery.data?.content ?? [];

  function toggleEvent(eventType: EventType) {
    const next = toggleValue(selectedEvents, eventType);
    updateParams(setSearchParams, { event_type: next.join(','), page: '0' });
  }

  function toggleColor(color: ColorTag) {
    const next = toggleValue(selectedColors, color);
    updateParams(setSearchParams, { colors: next.join(','), page: '0' });
  }

  function changeSort(nextSort: TemplateSort) {
    updateParams(setSearchParams, { sort: nextSort, page: '0' });
  }

  function resetFilters() {
    setSearchInput('');
    setSearchParams({ sort: DEFAULT_SORT, page: '0' });
  }

  function changePage(nextPage: number) {
    updateParams(setSearchParams, { page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <MainLayout>
      <section className="bg-cream pb-20 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-gold">{t('catalog.eyebrow')}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-slate sm:text-5xl">{t('catalog.title')}</h1>
            <p className="mt-4 text-slate/60">{t('catalog.description')}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <FilterPanel
              selectedEvents={selectedEvents}
              selectedColors={selectedColors}
              sort={sort}
              onToggleEvent={toggleEvent}
              onToggleColor={toggleColor}
              onSortChange={changeSort}
              onReset={resetFilters}
            />

            <div className="space-y-6">
              <label className="block">
                <span className="sr-only">{t('catalog.search.label')}</span>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={t('catalog.search.placeholder')}
                  className="w-full rounded-3xl border border-lightrose bg-white px-5 py-4 text-slate outline-none shadow-card focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
              </label>

              {templatesQuery.isLoading ? <CatalogState type="loading" /> : null}
              {templatesQuery.isError ? <CatalogState type="error" onRetry={() => void templatesQuery.refetch()} /> : null}
              {templatesQuery.isSuccess && templates.length === 0 ? <CatalogState type="empty" /> : null}

              {templatesQuery.isSuccess && templates.length > 0 ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate/60">
                    <span>
                      {t('catalog.resultCount', {
                        from: templatesQuery.data.currentPage * templatesQuery.data.size + 1,
                        to: templatesQuery.data.currentPage * templatesQuery.data.size + templates.length,
                        total: templatesQuery.data.totalElements,
                      })}
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {templates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onAddToCartClick={() => addToCart(template.id)}
                      />
                    ))}
                  </div>

                  <CatalogPagination
                    currentPage={templatesQuery.data.currentPage}
                    totalPages={templatesQuery.data.totalPages}
                    hasPrevious={templatesQuery.data.hasPrevious}
                    hasNext={templatesQuery.data.hasNext}
                    onPageChange={changePage}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
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
    return next;
  });
}
