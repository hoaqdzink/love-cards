import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckoutPage } from '../../pages/CheckoutPage';

const navigate = vi.fn();
const createOrder = vi.fn();

vi.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'cart.empty.title': 'Giỏ trống',
        'checkout.backToCart': 'Quay lại giỏ',
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
        'checkout.placingOrder': 'Đang đặt…',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/app/store/useCartStore', () => ({
  useCartStore: (selector: (state: { items: string[] }) => unknown) =>
    selector({ items: ['11111111-1111-4111-8111-111111111111'] }),
}));

vi.mock('@/features/cart/hooks', () => ({
  useEnrichedCart: () => ({
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
    subtotal: 99000,
  }),
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

vi.mock('@/features/cart/api/commerceApi', () => ({
  commerceApi: {
    createOrder: (...args: unknown[]) => createOrder(...args),
  },
}));

function renderCheckout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    navigate.mockReset();
    createOrder.mockReset();
    createOrder.mockResolvedValue({ orderCode: 'LC-20260603-0001' });
  });

  it('renders item summary and totals', () => {
    renderCheckout();

    expect(screen.getByRole('heading', { name: 'Thanh toán' })).toBeInTheDocument();
    expect(screen.getByText('Peony Dream')).toBeInTheDocument();
    expect(screen.getByText('Tổng cộng')).toBeInTheDocument();
    expect(screen.getByText('Thanh toán sắp có')).toBeInTheDocument();
  });

  it('submits order with selected hosting plan', async () => {
    const user = userEvent.setup();
    renderCheckout();

    await user.click(screen.getByRole('button', { name: 'Đặt hàng' }));

    expect(createOrder).toHaveBeenCalledWith([
      {
        templateId: '11111111-1111-4111-8111-111111111111',
        hostingPlanId: '90000000-0000-4000-8000-000000000006',
      },
    ]);
  });
});
