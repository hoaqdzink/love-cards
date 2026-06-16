import { Eye } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import type { TemplateListItem } from '@/features/catalog/types';
import { formatVnd, formatViewCount, isTemplateNew } from '@/features/catalog/utils/catalogLabels';

type TemplateCardProps = {
  template: TemplateListItem;
  onPreviewClick?: (template: TemplateListItem) => void;
  onUseTemplateClick?: (template: TemplateListItem) => void;
};

export function TemplateCard({ template, onPreviewClick, onUseTemplateClick }: TemplateCardProps) {
  const { t } = useTranslation();
  const isNew = isTemplateNew(template.createdAt);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-lightrose bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <button
        type="button"
        onClick={() => onPreviewClick?.(template)}
        className="relative block w-full overflow-hidden bg-cream text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/40 focus-visible:ring-offset-2"
        aria-label={t('catalog.card.previewAria', { name: template.name })}
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={template.thumbnailUrl || template.previewUrl}
            alt={template.name}
            loading="lazy"
            width={320}
            height={427}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {template.featured ? (
            <span className="rounded-full bg-rose px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t('catalog.badges.featured')}
            </span>
          ) : null}
          {template.trending ? (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t('catalog.badges.trending')}
            </span>
          ) : null}
          {isNew ? (
            <span className="rounded-full bg-slate px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t('catalog.badges.new')}
            </span>
          ) : null}
        </div>

        <span className="absolute inset-0 flex items-center justify-center bg-slate/0 opacity-0 transition-all group-hover:bg-slate/20 group-hover:opacity-100 group-focus-within:bg-slate/20 group-focus-within:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate shadow-md">
            <Eye size={16} weight="bold" aria-hidden />
            {t('actions.preview')}
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-1 font-serif text-base font-bold text-slate">{template.name}</h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-rose">{formatVnd(template.price)}</span>
          <span className="text-slate/30" aria-hidden>
            ·
          </span>
          <span className="text-xs text-slate/50">
            {formatViewCount(template.viewCount)} {t('catalog.card.views')}
          </span>
          <span className="text-slate/30" aria-hidden>
            ·
          </span>
          <span className="text-xs text-slate/50">
            {formatViewCount(template.purchaseCount)} {t('catalog.card.uses')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onUseTemplateClick?.(template)}
          className="mt-auto inline-flex min-h-10 w-full items-center justify-center rounded-full bg-rose px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-rose/90 focus-visible:ring-2 focus-visible:ring-rose/40"
        >
          {t('actions.useTemplate')}
        </button>
      </div>
    </article>
  );
}
