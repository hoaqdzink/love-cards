/**
 * Chi tiết đơn hàng sau khi tạo — hiển thị mã đơn, trạng thái CREATED, line items.
 * Route: `/orders/:orderCode`. Phase 2.5: nút thanh toán thật.
 */
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout';
import { formatVnd } from '@/features/catalog/utils/catalogLabels';
import { commerceApi } from '@/features/cart/api/commerceApi';
import type { Order } from '@/features/cart/types';

export function OrderDetailPage() {
  const { t } = useTranslation();
  const { orderCode = '' } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderCode],
    queryFn: () => commerceApi.getOrder(orderCode),
    enabled: Boolean(orderCode),
  });

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        {renderOrderContent({ t, order, isLoading, isError })}
      </div>
    </MainLayout>
  );
}

type OrderContentProps = {
  t: (key: string) => string;
  order: Order | undefined;
  isLoading: boolean;
  isError: boolean;
};

/** Phân nhánh loading / lỗi / chi tiết đơn — tránh nested ternary trong JSX. */
function renderOrderContent({ t, order, isLoading, isError }: OrderContentProps) {
  if (isLoading) {
    return <p className="text-slate/70">{t('order.loading')}</p>;
  }

  if (isError || !order) {
    return (
      <div>
        <p className="text-slate font-medium">{t('order.notFound')}</p>
        <Link to="/cart" className="inline-block mt-4 text-rose hover:underline">
          {t('checkout.backToCart')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm uppercase tracking-wide text-rose font-medium">{t('order.confirmed')}</p>
      {/* break-all: mã đơn dài không tràn layout mobile (P2-51) */}
      <h1 className="font-serif text-2xl sm:text-3xl text-slate mt-2 break-all">{order.orderCode}</h1>
      <p className="mt-2 text-slate/70">
        {t('order.status')}: <span className="font-medium text-slate">{order.status}</span>
      </p>
      <p className="mt-1 text-slate/70">
        {t('order.total')}: <span className="font-semibold text-slate">{formatVnd(order.totalAmount)}</span>
      </p>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {t('order.paymentComingSoon')}
      </div>

      <ul className="mt-8 space-y-4">
        {order.items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-lightrose bg-white p-4">
            <p className="font-medium text-slate">{item.template.name}</p>
            <p className="text-sm text-slate/70 mt-1">
              {item.hostingPlan.name} — {formatVnd(item.hostingPrice)}
            </p>
            <p className="text-sm text-slate/70">
              {t('checkout.templatePrice')}: {formatVnd(item.templatePrice)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          to="/mau-thiep"
          className="inline-flex justify-center px-6 py-2.5 rounded-full border border-lightrose text-slate hover:bg-white"
        >
          {t('order.continueShopping')}
        </Link>
        <Link
          to="/cart"
          className="inline-flex justify-center px-6 py-2.5 rounded-full bg-rose text-white hover:bg-rose/90"
        >
          {t('cart.title')}
        </Link>
      </div>
    </>
  );
}
