import { useTranslation } from 'react-i18next';
import type { ColorTag, EventType, TemplateSort } from '@/features/catalog/types';
import { COLOR_OPTIONS, EVENT_TYPE_OPTIONS, SORT_OPTIONS } from '@/features/catalog/utils/catalogLabels';

type FilterPanelProps = {
  selectedEvents: EventType[];
  selectedColors: ColorTag[];
  sort: TemplateSort;
  onToggleEvent: (eventType: EventType) => void;
  onToggleColor: (color: ColorTag) => void;
  onSortChange: (sort: TemplateSort) => void;
  onReset: () => void;
};

export function FilterPanel({
  selectedEvents,
  selectedColors,
  sort,
  onToggleEvent,
  onToggleColor,
  onSortChange,
  onReset,
}: FilterPanelProps) {
  const { t } = useTranslation();

  return (
    <aside className="space-y-8 rounded-3xl border border-lightrose bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-slate">{t('catalog.filters.title')}</h2>
        <button type="button" onClick={onReset} className="text-sm font-medium text-rose hover:text-rose/80">
          {t('catalog.filters.reset')}
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate/60">
          {t('catalog.filters.eventType')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPE_OPTIONS.map((option) => {
            const active = selectedEvents.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onToggleEvent(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-rose text-white' : 'bg-cream text-slate hover:bg-lightrose/60'
                }`}
                aria-pressed={active}
              >
                {t(option.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate/60">
          {t('catalog.filters.color')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {COLOR_OPTIONS.map((option) => {
            const active = selectedColors.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onToggleColor(option.value)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                  active ? 'border-rose text-rose' : 'border-lightrose text-slate hover:bg-cream'
                }`}
                aria-pressed={active}
              >
                <span className={`h-4 w-4 rounded-full border border-slate/10 ${option.className}`} />
                {t(option.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-slate/60">
          {t('catalog.sort.label')}
        </span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as TemplateSort)}
          className="w-full rounded-2xl border border-lightrose bg-cream px-4 py-3 text-sm text-slate outline-none focus:border-rose focus:ring-2 focus:ring-rose/20"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );
}
