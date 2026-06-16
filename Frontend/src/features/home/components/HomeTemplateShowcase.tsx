import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TemplateCard, TemplateQuickPreviewModal } from '@/features/catalog/components';
import {
  useFeaturedTemplates,
  useTemplates,
  useTrendingTemplates,
} from '@/features/catalog/hooks';
import type { TemplateListItem } from '@/features/catalog/types';
import { HomeSearchBar } from '@/features/home/components/HomeSearchBar';

type ShowcaseTab = 'featured' | 'newest' | 'trending' | 'bestseller';

const TAB_KEYS: ShowcaseTab[] = ['featured', 'newest', 'trending', 'bestseller'];
const HOME_GRID_SIZE = 8;

const QUICK_FILTERS = [
  { labelKey: 'home.showcase.filters.wedding', path: '/mau-thiep?event_type=wedding' },
  { labelKey: 'home.showcase.filters.birthday', path: '/mau-thiep?event_type=birthday' },
  { labelKey: 'home.showcase.filters.pink', path: '/mau-thiep?colors=pink' },
  { labelKey: 'home.showcase.filters.free', path: '/mau-thiep?price=free' },
] as const;

export function HomeTemplateShowcase() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('featured');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateListItem | null>(null);

  const featuredQuery = useFeaturedTemplates();
  const trendingQuery = useTrendingTemplates();
  const newestQuery = useTemplates({ sort: 'newest', size: HOME_GRID_SIZE, page: 0 });
  const bestsellerQuery = useTemplates({ sort: 'popular', size: HOME_GRID_SIZE, page: 0 });

  const templates = useMemo(() => {
    switch (activeTab) {
      case 'featured':
        return featuredQuery.data ?? [];
      case 'newest':
        return newestQuery.data?.content ?? [];
      case 'trending':
        return trendingQuery.data ?? [];
      case 'bestseller':
        return bestsellerQuery.data?.content ?? [];
      default:
        return [];
    }
  }, [activeTab, featuredQuery.data, newestQuery.data, trendingQuery.data, bestsellerQuery.data]);

  const isLoading =
    (activeTab === 'featured' && featuredQuery.isLoading) ||
    (activeTab === 'newest' && newestQuery.isLoading) ||
    (activeTab === 'trending' && trendingQuery.isLoading) ||
    (activeTab === 'bestseller' && bestsellerQuery.isLoading);

  const isError =
    (activeTab === 'featured' && featuredQuery.isError) ||
    (activeTab === 'newest' && newestQuery.isError) ||
    (activeTab === 'trending' && trendingQuery.isError) ||
    (activeTab === 'bestseller' && bestsellerQuery.isError);

  function handleUseTemplate(template: TemplateListItem) {
    setPreviewTemplate(null);
    navigate(`/mau-thiep/${template.slug}`);
  }

  return (
    <section id="templates" className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-6 space-y-4 reveal">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate sm:text-4xl">
                {t('home.showcase.title')}
              </h2>
              <p className="mt-2 text-slate/60">{t('home.showcase.description')}</p>
            </div>
            <Link
              to="/mau-thiep"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-rose hover:text-rose/80"
            >
              {t('home.templates.viewAll')}
              <span aria-hidden>→</span>
            </Link>
          </div>

          <HomeSearchBar />

          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map((filter) => (
              <Link
                key={filter.path}
                to={filter.path}
                className="rounded-full border border-lightrose bg-white px-3 py-1.5 text-xs font-medium text-slate transition-colors hover:border-rose hover:text-rose"
              >
                {t(filter.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mb-6 flex flex-wrap gap-2 reveal"
          role="tablist"
          aria-label={t('home.showcase.tabsLabel')}
        >
          {TAB_KEYS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/30 ${
                activeTab === tab
                  ? 'bg-rose text-white shadow-md'
                  : 'border border-lightrose bg-white text-slate hover:bg-lightrose/40'
              }`}
            >
              {t(`home.showcase.tabs.${tab}`)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-slate/60">{t('messages.loading')}</p>
        ) : null}

        {isError ? (
          <p className="py-12 text-center text-sm text-slate/60">{t('home.showcase.error')}</p>
        ) : null}

        {!isLoading && !isError && templates.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate/60">{t('catalog.states.empty.title')}</p>
        ) : null}

        {!isLoading && templates.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 reveal">
            {templates.slice(0, HOME_GRID_SIZE).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreviewClick={setPreviewTemplate}
                onUseTemplateClick={handleUseTemplate}
              />
            ))}
          </div>
        ) : null}
      </div>

      <TemplateQuickPreviewModal
        template={previewTemplate}
        open={previewTemplate != null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
      />
    </section>
  );
}
