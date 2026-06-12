import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CardProductGrid } from '@/shared/components/card-product';
import type { CardProductItem } from '@/shared/components/card-product';
import { useFeaturedTemplates } from '@/features/catalog/hooks';
import { featuredCardProducts } from '@/features/home/data/cardProducts';

const templatePreviewAnimation = {
  durationMs: 5000,
  easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  translateMaxPx: 300,
  iframeContentHeightPx: 800,
} as const;

export function TemplateSection() {
  const { t } = useTranslation();
  const featuredQuery = useFeaturedTemplates();
  const items = featuredQuery.data ? toCardProducts(featuredQuery.data) : featuredCardProducts;

  return (
    <section id="templates" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12 reveal">
          <div>
            <h2 className="font-serif text-4xl font-bold text-slate">{t('home.templates.title')}</h2>
            <p className="text-slate/60 mt-2">{t('home.templates.description')}</p>
            <p className="mt-2 text-xs text-slate/50 max-w-xl">
              {t('home.templates.mobileHint')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/mau-thiep" className="text-rose font-medium hover:text-rose/80 transition-colors flex items-center gap-1">
              {t('home.templates.viewAll')} <i className="ph ph-arrow-right" />
            </Link>
          </div>
        </div>

        <CardProductGrid items={items} animation={templatePreviewAnimation} className="reveal" />
      </div>
    </section>
  );
}

function toCardProducts(templates: Array<{ id: string; name: string; description: string; previewUrl: string; slug: string }>): CardProductItem[] {
  return templates.map((template) => ({
    id: template.id,
    title: template.name,
    description: template.description,
    previewUrl: template.previewUrl,
    fullViewUrl: `/mau-thiep/${template.slug}`,
    fullViewMode: 'newTab',
    previewHintBadge: 'Preview',
  }));
}
