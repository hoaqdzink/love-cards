import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { TemplateCard } from '../../components/TemplateCard';
import type { TemplateListItem } from '@/features/catalog/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'actions.addToCart': 'Thêm giỏ hàng',
        'actions.preview': 'Xem trước',
        'catalog.badges.featured': 'Nổi bật',
        'catalog.badges.trending': 'Thịnh hành',
        'catalog.card.views': 'lượt xem',
        'catalog.filters.colors.pink': 'Hồng',
        'catalog.filters.colors.white': 'Trắng',
        'catalog.filters.events.wedding': 'Đám cưới',
      })[key] ?? key,
  }),
}));

describe('TemplateCard', () => {
  it('renders template summary, badges and preview links', () => {
    render(
      <MemoryRouter>
        <TemplateCard template={template} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Peony Dream' })).toBeInTheDocument();
    expect(screen.getByText('Đám cưới')).toBeInTheDocument();
    expect(screen.getByText('Nổi bật')).toBeInTheDocument();
    expect(screen.getByText('Thịnh hành')).toBeInTheDocument();
    expect(screen.getByText(/99.000/)).toBeInTheDocument();
    expect(screen.getByText(/2.400 lượt xem/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Peony Dream' })).toHaveAttribute('loading', 'lazy');
    expect(screen.getByRole('link', { name: 'Xem trước' })).toHaveAttribute('href', '/mau-thiep/peony-dream');
  });

  it('calls add-to-cart handler from the CTA button', async () => {
    const user = userEvent.setup();
    const onAddToCartClick = vi.fn();

    render(
      <MemoryRouter>
        <TemplateCard template={template} onAddToCartClick={onAddToCartClick} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Thêm giỏ hàng' }));

    expect(onAddToCartClick).toHaveBeenCalledTimes(1);
  });
});

const template: TemplateListItem = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Peony Dream',
  slug: 'peony-dream',
  description: 'Thiệp cưới hồng pastel với hoa mẫu đơn mềm mại.',
  eventType: 'wedding',
  colorTags: ['pink', 'white'],
  price: 99000,
  previewUrl: '/api/v1/template-assets/peony-dream/preview.html',
  thumbnailUrl: '/api/v1/template-assets/peony-dream/thumbnail.svg',
  hasMusic: true,
  featured: true,
  trending: true,
  viewCount: 2400,
  purchaseCount: 180,
  createdAt: '2026-05-25T09:00:00',
};
