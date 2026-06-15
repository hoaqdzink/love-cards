/**
 * Trang giỏ hàng — hiển thị mẫu đã chọn (cookie Zustand `lc_cart`).
 * Route: `/cart`. Hydrate metadata mẫu qua `useEnrichedCart`.
 * Phase 2: chưa sync giỏ lên DB mỗi lần thêm; không xóa giỏ sau tạo đơn.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layouts/MainLayout';
import { useCartStore } from '@/app/store/useCartStore';
import { formatVnd } from '@/features/catalog/utils/catalogLabels';
import { useEnrichedCart } from '@/features/cart/hooks';

export function CartPage() {
  const { t } = useTranslation();
  const removeItem = useCartStore((state) => state.removeItem);
  const { lines, isLoading, subtotal, itemCount } = useEnrichedCart();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="font-serif text-2xl sm:text-3xl text-slate">{t('cart.title')}</h1>
        <p className="mt-2 text-slate/70">{t('cart.subtitle', { count: itemCount })}</p>

        {itemCount === 0 ? (
          /* Empty state — hướng khách về danh mục */
          <div className="mt-10 rounded-2xl border border-lightrose bg-white p-8 text-center">
            <p className="text-slate font-medium">{t('cart.empty.title')}</p>
            <p className="mt-2 text-slate/70 text-sm">{t('cart.empty.description')}</p>
            <Link
              to="/mau-thiep"
              className="inline-flex mt-6 px-6 py-2.5 rounded-full bg-rose text-white text-sm font-medium hover:bg-rose/90"
            >
              {t('cart.empty.cta')}
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {lines.map((line) => (
              <div
                key={line.templateId}
                className="flex items-start gap-3 sm:gap-4 rounded-2xl border border-lightrose bg-white p-4 sm:p-5"
              >
                {line.template?.thumbnailUrl ? (
                  <img
                    src={line.template.thumbnailUrl}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-lightrose/40 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate truncate">
                    {isLoading && !line.template ? t('cart.loadingItem') : line.template?.name ?? '—'}
                  </p>
                  <p className="mt-1 text-rose font-semibold">
                    {line.template ? formatVnd(line.template.price) : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm text-slate/70 hover:text-rose self-start"
                  onClick={() => removeItem(line.templateId)}
                >
                  {t('cart.remove')}
                </button>
              </div>
            ))}

            {/* Footer: tạm tính (chưa gồm hosting) + CTA checkout — flex-col mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-lightrose">
              <div>
                <p className="text-sm text-slate/70">{t('cart.estimatedTotal')}</p>
                <p className="text-xl font-semibold text-slate">{formatVnd(subtotal)}</p>
                <p className="text-xs text-slate/60 mt-1">{t('cart.hostingNote')}</p>
              </div>
              <Link
                to="/checkout"
                className="inline-flex justify-center px-8 py-3 rounded-full bg-rose text-white font-medium hover:bg-rose/90"
              >
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
