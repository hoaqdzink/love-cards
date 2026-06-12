import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TemplateListItem } from '@/features/catalog/types';
import { formatVnd } from '@/features/catalog/utils/catalogLabels';

type TemplateCardProps = {
  template: TemplateListItem;
  onAddToCartClick?: () => void;
};

export function TemplateCard({ template, onAddToCartClick }: TemplateCardProps) {
  const { t } = useTranslation();

  return (
    <article className="group overflow-hidden rounded-3xl border border-lightrose bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/mau-thiep/${template.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <img
            src={template.thumbnailUrl || template.previewUrl}
            alt={template.name}
            loading="lazy"
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {template.featured ? (
              <span className="rounded-full bg-rose px-3 py-1 text-xs font-semibold text-white">
                {t('catalog.badges.featured')}
              </span>
            ) : null}
            {template.trending ? (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
                {t('catalog.badges.trending')}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose">
            {t(`catalog.filters.events.${template.eventType}`)}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-slate">{template.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate/60">{template.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {template.colorTags.map((color) => (
            <span key={color} className="rounded-full bg-cream px-3 py-1 text-xs text-slate/70">
              {t(`catalog.filters.colors.${color}`)}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-slate">{formatVnd(template.price)}</span>
          <span className="text-xs text-slate/50">
            {template.viewCount.toLocaleString('vi-VN')} {t('catalog.card.views')}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/mau-thiep/${template.slug}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-rose px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose/90 focus-visible:ring-2 focus-visible:ring-rose/40"
          >
            {t('actions.preview')}
          </Link>
          <button
            type="button"
            onClick={onAddToCartClick}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-lightrose px-4 py-2 text-sm font-medium text-slate transition-colors hover:bg-lightrose/50 focus-visible:ring-2 focus-visible:ring-rose/30"
          >
            {t('actions.addToCart')}
          </button>
        </div>
      </div>
    </article>
  );
}
