import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CartPage } from './CartPage';

const removeItem = vi.fn();

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
        'cart.empty.description': 'Hãy chọn mẫu thiệp',
        'cart.empty.cta': 'Xem mẫu thiệp',
        'cart.remove': 'Xóa',
        'cart.estimatedTotal': 'Tạm tính',
        'cart.hostingNote': 'Chưa gồm hosting',
        'cart.checkout': 'Thanh toán',
        'cart.loadingItem': 'Đang tải…',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/app/store/useCartStore', () => ({
  useCartStore: (selector: (state: { removeItem: typeof removeItem }) => unknown) =>
    selector({ removeItem }),
}));

const useEnrichedCartMock = vi.fn();

vi.mock('@/features/cart/hooks', () => ({
  useEnrichedCart: () => useEnrichedCartMock(),
}));

describe('CartPage', () => {
  beforeEach(() => {
    removeItem.mockReset();
    useEnrichedCartMock.mockReset();
  });

  it('renders empty state when cart has no items', () => {
    useEnrichedCartMock.mockReturnValue({
      lines: [],
      isLoading: false,
      subtotal: 0,
      itemCount: 0,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Giỏ hàng' })).toBeInTheDocument();
    expect(screen.getByText('Giỏ trống')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xem mẫu thiệp' })).toHaveAttribute('href', '/mau-thiep');
  });

  it('renders enriched items, subtotal and checkout link', () => {
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

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Peony Dream')).toBeInTheDocument();
    expect(screen.getAllByText(/99\.000/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Thanh toán' })).toHaveAttribute('href', '/checkout');
  });

  it('calls removeItem when delete button is clicked', async () => {
    const user = userEvent.setup();
    const templateId = '11111111-1111-4111-8111-111111111111';

    useEnrichedCartMock.mockReturnValue({
      lines: [
        {
          templateId,
          template: {
            id: templateId,
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

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Xóa' }));

    expect(removeItem).toHaveBeenCalledWith(templateId);
  });
});
