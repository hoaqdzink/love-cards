/**
 * Trang thanh toán — chọn gói hosting **theo từng mẫu** (Q07) và tạo đơn CREATED.
 * Route: `/checkout`. Redirect `/orders/:orderCode` khi POST thành công.
 * Phase 2.5: payment; Phase 2 không clearCart sau tạo đơn.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout';
import { useCartStore } from '@/app/store/useCartStore';
import { formatVnd } from '@/features/catalog/utils/catalogLabels';
import { commerceApi } from '@/features/cart/api/commerceApi';
import { useEnrichedCart, useHostingPlans } from '@/features/cart/hooks';
import type { CreateOrderItem } from '@/features/cart/types';
import { ApiError } from '@/shared/services/api';

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const itemIds = useCartStore((state) => state.items);
  const { lines, subtotal } = useEnrichedCart();
  const { data: plans = [], isLoading: plansLoading } = useHostingPlans();
  const recommendedPlan = plans.find((p) => p.recommended) ?? plans[0];

  // Lựa chọn hosting do user đổi select; mặc định gán plan recommended
  const [selection, setSelection] = useState<Record<string, string>>({});

  const effectiveSelection = useMemo(() => {
    const map: Record<string, string> = { ...selection };
    for (const id of itemIds) {
      if (!map[id] && recommendedPlan) {
        map[id] = recommendedPlan.id;
      }
    }
    return map;
  }, [itemIds, recommendedPlan, selection]);

  const hostingTotal = itemIds.reduce((sum, templateId) => {
    const planId = effectiveSelection[templateId];
    const plan = plans.find((p) => p.id === planId);
    return sum + (plan?.price ?? 0);
  }, 0);

  const grandTotal = subtotal + hostingTotal;

  const createOrder = useMutation({
    mutationFn: (items: CreateOrderItem[]) => commerceApi.createOrder(items),
    onSuccess: (order) => {
      navigate(`/orders/${order.orderCode}`);
    },
  });

  if (itemIds.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <p className="text-slate">{t('cart.empty.title')}</p>
          <Link to="/cart" className="inline-block mt-4 text-rose hover:underline">
            {t('checkout.backToCart')}
          </Link>
        </div>
      </MainLayout>
    );
  }

  const allSelected = itemIds.every((id) => effectiveSelection[id]);

  /** Gửi POST /orders với hostingPlanId từng dòng — chỉ khi đã chọn đủ plan. */
  const handleSubmit = () => {
    if (!allSelected) return;
    const items: CreateOrderItem[] = itemIds.map((templateId) => ({
      templateId,
      hostingPlanId: effectiveSelection[templateId],
    }));
    createOrder.mutate(items);
  };

  const errorMessage =
    createOrder.error instanceof ApiError
      ? createOrder.error.userMessage
      : createOrder.error
        ? t('checkout.errorGeneric')
        : null;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="font-serif text-2xl sm:text-3xl text-slate">{t('checkout.title')}</h1>
        <p className="mt-2 text-slate/70">{t('checkout.subtitle')}</p>

        <div className="mt-8 space-y-6">
          {lines.map((line) => (
            <div key={line.templateId} className="rounded-2xl border border-lightrose bg-white p-5">
              <p className="font-medium text-slate">{line.template?.name ?? line.templateId}</p>
              <p className="text-sm text-slate/70 mt-1">
                {t('checkout.templatePrice')}: {line.template ? formatVnd(line.template.price) : '—'}
              </p>
              <label className="block mt-4 text-sm font-medium text-slate">
                {t('checkout.hostingPlan')}
                <select
                  className="mt-2 w-full rounded-xl border border-lightrose px-3 py-2 text-slate bg-white"
                  value={effectiveSelection[line.templateId] ?? ''}
                  disabled={plansLoading || plans.length === 0}
                  onChange={(e) =>
                    setSelection((prev) => ({ ...prev, [line.templateId]: e.target.value }))
                  }
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {formatVnd(plan.price)} ({plan.durationMonths} {t('checkout.months')})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>

        {/* Tóm tắt tiền: mẫu + hosting + tổng */}
        <div className="mt-8 rounded-2xl border border-lightrose bg-lightrose/20 p-5">
          <div className="flex justify-between gap-3 text-slate text-sm sm:text-base">
            <span className="min-w-0">{t('checkout.templatesSubtotal')}</span>
            <span className="shrink-0 tabular-nums">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex justify-between gap-3 text-slate mt-2 text-sm sm:text-base">
            <span className="min-w-0">{t('checkout.hostingSubtotal')}</span>
            <span className="shrink-0 tabular-nums">{formatVnd(hostingTotal)}</span>
          </div>
          <div className="flex justify-between gap-3 font-semibold text-slate mt-4 pt-4 border-t border-lightrose text-sm sm:text-base">
            <span className="min-w-0">{t('checkout.grandTotal')}</span>
            <span className="shrink-0 tabular-nums">{formatVnd(grandTotal)}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate/60">{t('checkout.paymentComingSoon')}</p>

        {errorMessage ? <p className="mt-4 text-sm text-red-600">{errorMessage}</p> : null}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={!allSelected || createOrder.isPending || plansLoading}
            className="px-8 py-3 rounded-full bg-rose text-white font-medium hover:bg-rose/90 disabled:opacity-50"
            onClick={handleSubmit}
          >
            {createOrder.isPending ? t('checkout.placingOrder') : t('checkout.placeOrder')}
          </button>
          <Link
            to="/cart"
            className="inline-flex justify-center px-8 py-3 rounded-full border border-lightrose text-slate hover:bg-white"
          >
            {t('checkout.backToCart')}
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
