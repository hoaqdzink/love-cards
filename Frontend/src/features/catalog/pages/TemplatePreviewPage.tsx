import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layouts/MainLayout';
import { useAddToCart } from '@/features/cart/hooks';
import { CatalogState } from '@/features/catalog/components';
import { useTemplateDetail } from '@/features/catalog/hooks';
import { formatVnd } from '@/features/catalog/utils/catalogLabels';

export function TemplatePreviewPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const templateQuery = useTemplateDetail(slug);
  const template = templateQuery.data;

  return (
    <MainLayout>
      <section className="bg-cream pb-20 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link to="/mau-thiep" className="mb-6 inline-flex text-sm font-medium text-rose hover:text-rose/80">
            {t('catalog.preview.backToCatalog')}
          </Link>

          {templateQuery.isLoading ? <CatalogState type="loading" /> : null}
          {templateQuery.isError ? <CatalogState type="error" onRetry={() => void templateQuery.refetch()} /> : null}

          {template ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="overflow-hidden rounded-3xl border border-lightrose bg-white shadow-card">
                <iframe
                  title={t('catalog.preview.iframeTitle', { name: template.name })}
                  src={template.previewUrl}
                  className="h-[720px] w-full border-0 bg-white"
                  sandbox=""
                  loading="lazy"
                />
              </div>

              <aside className="h-fit rounded-3xl border border-lightrose bg-white p-6 shadow-card">
                <p className="text-sm font-bold uppercase tracking-widest text-gold">
                  {t(`catalog.filters.events.${template.eventType}`)}
                </p>
                <h1 className="mt-3 font-serif text-4xl font-bold text-slate">{template.name}</h1>
                <p className="mt-4 text-slate/60">{template.description}</p>
                <p className="mt-6 text-2xl font-semibold text-slate">{formatVnd(template.price)}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {template.colorTags.map((color) => (
                    <span key={color} className="rounded-full bg-cream px-3 py-1 text-xs text-slate/70">
                      {t(`catalog.filters.colors.${color}`)}
                    </span>
                  ))}
                </div>

                <div className="mt-8">
                  <h2 className="font-serif text-2xl font-bold text-slate">{t('catalog.preview.fieldsTitle')}</h2>
                  <ul className="mt-4 space-y-3">
                    {template.fields.map((field) => (
                      <li key={field.id} className="rounded-2xl bg-cream px-4 py-3 text-sm text-slate/70">
                        <span className="font-medium text-slate">{field.fieldLabel}</span>
                        <span className="ml-2 text-xs uppercase tracking-widest text-slate/40">
                          {field.fieldType}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 grid gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(template.id)}
                    className="min-h-12 rounded-full bg-rose px-5 py-3 text-sm font-medium text-white hover:bg-rose/90"
                  >
                    {t('actions.addToCart')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(template.id);
                      navigate('/checkout');
                    }}
                    className="min-h-12 rounded-full border border-lightrose px-5 py-3 text-sm font-medium text-slate hover:bg-lightrose/50"
                  >
                    {t('actions.buyNow')}
                  </button>
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </section>
    </MainLayout>
  );
}
