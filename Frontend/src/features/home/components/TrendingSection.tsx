import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/app/store/useUIStore';
import { TemplateCard } from '@/features/catalog/components';
import { useTrendingTemplates } from '@/features/catalog/hooks';

export function TrendingSection() {
  const { t } = useTranslation();
  const addToast = useUIStore((state) => state.addToast);
  const trendingQuery = useTrendingTemplates();
  const templates = trendingQuery.data ?? [];

  return (
    <section id="trending" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lightrose/60 text-rose text-sm font-bold">
                <i className="ph-fill ph-trend-up pulse-dot" /> {t('home.trending.title')}
            </span>
            <span className="text-sm text-slate/50">{t('home.trending.subtitle')}</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
            {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onAddToCartClick={() => addToast(t('catalog.cart.developing'), 'info')}
                />
            ))}
            </div>
            {trendingQuery.isError ? (
              <p className="mt-6 text-sm text-slate/50">{t('home.trending.error')}</p>
            ) : null}
        </div>
    </section>
  );
}