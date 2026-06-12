import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { OrderDetailPage } from './OrderDetailPage';

vi.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const map: Record<string, string> = {
        'cart.title': 'Giỏ hàng',
        'cart.subtitle': `Bạn có ${params?.count ?? 0} mẫu`,
        'cart.empty.title': 'Giỏ trống',
        'cart.estimatedTotal': 'Tạm tính',
        'cart.hostingNote': 'Chưa gồm hosting',
        'cart.checkout': 'Thanh toán',
        'cart.remove': 'Xóa',
        'checkout.title': 'Thanh toán',
        'checkout.subtitle': 'Chọn gói hosting',
        'checkout.templatePrice': 'Giá mẫu',
        'checkout.hostingPlan': 'Gói hosting',
        'checkout.months': 'tháng',
        'checkout.templatesSubtotal': 'Tổng mẫu',
        'checkout.hostingSubtotal': 'Tổng hosting',
        'checkout.grandTotal': 'Tổng cộng',
        'checkout.paymentComingSoon': 'Thanh toán sắp có',
        'checkout.placeOrder': 'Đặt hàng',
        'order.confirmed': 'Đã tạo đơn',
        'order.status': 'Trạng thái',
        'order.total': 'Tổng',
        'order.paymentComingSoon': 'Thanh toán sắp có',
        'order.continueShopping': 'Tiếp tục mua sắm',
      };
      return map[key] ?? key;
    },
  }),
}));

const useEnrichedCartMock = vi.fn();

vi.mock('@/features/cart/hooks', () => ({
  useEnrichedCart: () => useEnrichedCartMock(),
  useHostingPlans: () => ({
    data: [
      {
        id: '90000000-0000-4000-8000-000000000006',
        name: 'Gói 6 tháng',
        durationMonths: 6,
        price: 99000,
        recommended: true,
        features: [],
      },
    ],
    isLoading: false,
  }),
}));

vi.mock('@/app/store/useCartStore', () => ({
  useCartStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      items: ['11111111-1111-4111-8111-111111111111'],
      removeItem: vi.fn(),
    }),
}));

vi.mock('@/features/cart/api/commerceApi', () => ({
  commerceApi: {
    getOrder: vi.fn().mockResolvedValue({
      orderCode: 'LC-20260612-WPNP',
      status: 'created',
      totalAmount: 198000,
      items: [
        {
          id: '1',
          templatePrice: 99000,
          hostingPrice: 99000,
          template: { name: 'Peony Dream' },
          hostingPlan: { name: 'Gói 6 tháng' },
        },
      ],
    }),
  },
}));

function renderWithProviders(ui: React.ReactElement, route = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/cart" element={ui} />
          <Route path="/checkout" element={ui} />
          <Route path="/orders/:orderCode" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Phase 2 responsive layout (P2-51)', () => {
  beforeEach(() => {
    useEnrichedCartMock.mockReturnValue({
      lines: [
        {
          templateId: '11111111-1111-4111-8111-111111111111',
          template: {
            id: '11111111-1111-4111-8111-111111111111',
            name: 'Peony Dream',
            slug: 'peony-dream',
            price: 99000,
            thumbnailUrl: '/thumb.svg',
          },
        },
      ],
      isLoading: false,
      subtotal: 99000,
      itemCount: 1,
    });
  });

  it('CartPage stacks checkout CTA on narrow viewports (sm:flex-row)', () => {
    renderWithProviders(<CartPage />, '/cart');
    const footer = screen.getByRole('link', { name: 'Thanh toán' }).parentElement;
    expect(footer?.className).toMatch(/flex-col/);
    expect(footer?.className).toMatch(/sm:flex-row/);
  });

  it('CheckoutPage stacks action buttons on narrow viewports', () => {
    renderWithProviders(<CheckoutPage />, '/checkout');
    const placeOrder = screen.getByRole('button', { name: 'Đặt hàng' });
    const actions = placeOrder.parentElement;
    expect(actions?.className).toMatch(/flex-col/);
    expect(actions?.className).toMatch(/sm:flex-row/);
  });

  it('OrderDetailPage stacks footer links and wraps long order codes', async () => {
    renderWithProviders(<OrderDetailPage />, '/orders/LC-20260612-WPNP');
    const heading = await screen.findByRole('heading', { name: 'LC-20260612-WPNP' });
    expect(heading.className).toMatch(/break-all/);
    expect(heading.className).toMatch(/text-2xl/);

    const continueLink = screen.getByRole('link', { name: 'Tiếp tục mua sắm' });
    const actions = continueLink.parentElement;
    expect(actions?.className).toMatch(/flex-col/);
    expect(actions?.className).toMatch(/sm:flex-row/);
  });
});
