import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { TemplateCard, TemplateCardSkeleton, TemplateQuickPreviewModal } from '@/features/catalog/components';
import { useFeaturedTemplates } from '@/features/catalog/hooks';
import type { TemplateListItem } from '@/features/catalog/types';

const SPOTLIGHT_LIMIT = 4;
const SKELETON_COUNT = 4;

export function FeaturedSpotlight() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const featuredQuery = useFeaturedTemplates();
  const [previewTemplate, setPreviewTemplate] = useState<TemplateListItem | null>(null);

  const templates = (featuredQuery.data ?? []).slice(0, SPOTLIGHT_LIMIT);
  const showSkeleton = templates.length === 0 && featuredQuery.isFetching;
  const showEmpty = templates.length === 0 && featuredQuery.isError;

  function handleUseTemplate(template: TemplateListItem) {
    setPreviewTemplate(null);
    navigate(`/mau-thiep/${template.slug}`);
  }

  return (
    <section id="featured" className="py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              {t('home.featured.eyebrow')}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate sm:text-4xl">{t('home.featured.title')}</h2>
            <p className="mt-3 text-slate/60">{t('home.featured.description')}</p>
          </div>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-busy="true" aria-label={t('messages.loading')}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <TemplateCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {showEmpty ? (
          <p className="py-16 text-center text-sm text-slate/60">{t('home.featured.error')}</p>
        ) : null}

        {templates.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreviewClick={setPreviewTemplate}
                onUseTemplateClick={handleUseTemplate}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <Link
            to="/mau-thiep"
            className="inline-flex items-center gap-2 rounded-full bg-rose px-8 py-3.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-rose/90 hover:shadow-soft"
          >
            {t('home.featured.browseLibrary')}
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
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
