import { useTranslation } from 'react-i18next';

type CatalogStateProps = {
  type: 'loading' | 'error' | 'empty';
  onRetry?: () => void;
};

export function CatalogState({ type, onRetry }: CatalogStateProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-lightrose bg-white p-10 text-center shadow-card">
      <h2 className="font-serif text-2xl font-bold text-slate">{t(`catalog.states.${type}.title`)}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate/60">{t(`catalog.states.${type}.description`)}</p>
      {type === 'error' && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-rose px-6 py-3 text-sm font-medium text-white hover:bg-rose/90"
        >
          {t('catalog.states.error.retry')}
        </button>
      ) : null}
    </div>
  );
}
