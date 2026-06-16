import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TemplateListItem } from '@/features/catalog/types';
import { formatVnd, formatViewCount } from '@/features/catalog/utils/catalogLabels';

type TemplateQuickPreviewModalProps = {
  template: TemplateListItem | null;
  open: boolean;
  onClose: () => void;
  onUseTemplate: (template: TemplateListItem) => void;
};

export function TemplateQuickPreviewModal({
  template,
  open,
  onClose,
  onUseTemplate,
}: TemplateQuickPreviewModalProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && template) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open, template]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDialogClose = () => onClose();
    el.addEventListener('close', onDialogClose);
    return () => el.removeEventListener('close', onDialogClose);
  }, [onClose]);

  if (!template) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="template-quick-preview-title"
      className="fixed left-1/2 top-1/2 z-[200] w-[min(96vw,1100px)] max-h-[min(92vh,900px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-lightrose bg-white p-0 shadow-2xl backdrop:bg-slate/40 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between gap-3 border-b border-lightrose px-4 py-3">
        <h2 id="template-quick-preview-title" className="truncate pr-2 font-serif text-lg font-semibold text-slate">
          {template.name}
        </h2>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate hover:bg-lightrose/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/30"
        >
          {t('actions.cancel')}
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-h-0 overflow-hidden bg-cream p-3 sm:p-4">
          <iframe
            title={t('catalog.preview.iframeTitle', { name: template.name })}
            src={template.previewUrl}
            className="h-[min(60vh,680px)] w-full rounded-xl border-0 bg-white lg:h-[min(75vh,720px)]"
            sandbox=""
            loading="lazy"
          />
        </div>

        <aside className="flex flex-col gap-4 border-t border-lightrose p-4 lg:border-l lg:border-t-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose">
              {t(`catalog.filters.events.${template.eventType}`)}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate">{formatVnd(template.price)}</p>
            <p className="mt-1 text-sm text-slate/60">
              {formatViewCount(template.viewCount)} {t('catalog.card.views')}
            </p>
          </div>

          <p className="line-clamp-4 text-sm text-slate/70">{template.description}</p>

          <div className="mt-auto grid gap-2">
            <button
              type="button"
              onClick={() => onUseTemplate(template)}
              className="min-h-11 rounded-full bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose/90"
            >
              {t('actions.useTemplate')}
            </button>
            <Link
              to={`/mau-thiep/${template.slug}`}
              onClick={() => ref.current?.close()}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-lightrose px-4 py-2 text-sm font-medium text-slate hover:bg-lightrose/50"
            >
              {t('catalog.preview.viewDetail')}
            </Link>
          </div>
        </aside>
      </div>
    </dialog>
  );
}
