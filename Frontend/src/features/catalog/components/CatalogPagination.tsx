import { useTranslation } from 'react-i18next';

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

export function CatalogPagination({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
}: CatalogPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={t('catalog.pagination.label')}>
      <button
        type="button"
        disabled={!hasPrevious}
        onClick={() => onPageChange(currentPage - 1)}
        className="min-h-11 rounded-full border border-lightrose px-4 py-2 text-sm font-medium text-slate disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('catalog.pagination.previous')}
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onPageChange(index)}
          className={`min-h-11 min-w-11 rounded-full px-4 py-2 text-sm font-medium ${
            index === currentPage ? 'bg-rose text-white' : 'border border-lightrose text-slate hover:bg-cream'
          }`}
          aria-current={index === currentPage ? 'page' : undefined}
        >
          {index + 1}
        </button>
      ))}
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="min-h-11 rounded-full border border-lightrose px-4 py-2 text-sm font-medium text-slate disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('catalog.pagination.next')}
      </button>
    </nav>
  );
}
