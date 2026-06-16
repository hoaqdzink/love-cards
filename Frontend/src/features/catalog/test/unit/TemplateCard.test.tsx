import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { TemplateCard } from '../../components/TemplateCard';
import type { TemplateListItem } from '@/features/catalog/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) =>
      ({
        'actions.useTemplate': 'Sử dụng mẫu',
        'actions.preview': 'Xem trước',
        'catalog.badges.featured': 'Nổi bật',
        'catalog.badges.trending': 'Xu hướng',
        'catalog.badges.new': 'Mới',
        'catalog.card.views': 'lượt xem',
        'catalog.card.uses': 'lượt dùng',
        'catalog.card.previewAria': `Xem trước mẫu ${options?.name ?? ''}`,
      })[key] ?? key,
  }),
}));

describe('TemplateCard', () => {
  it('renders compact template summary, badges and metadata', () => {
    render(
      <MemoryRouter>
        <TemplateCard template={template} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Peony Dream' })).toBeInTheDocument();
    expect(screen.getByText('Nổi bật')).toBeInTheDocument();
    expect(screen.getByText('Xu hướng')).toBeInTheDocument();
    expect(screen.getByText('Mới')).toBeInTheDocument();
    expect(screen.getByText(/99.000/)).toBeInTheDocument();
    expect(screen.getByText(/2.4k lượt xem/)).toBeInTheDocument();
    expect(screen.getByText(/180 lượt dùng/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Peony Dream' })).toHaveAttribute('loading', 'lazy');
    expect(screen.getByRole('button', { name: 'Sử dụng mẫu' })).toBeInTheDocument();
  });

  it('calls preview and use-template handlers', async () => {
    const user = userEvent.setup();
    const onPreviewClick = vi.fn();
    const onUseTemplateClick = vi.fn();

    render(
      <MemoryRouter>
        <TemplateCard
          template={template}
          onPreviewClick={onPreviewClick}
          onUseTemplateClick={onUseTemplateClick}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Xem trước mẫu Peony Dream' }));
    await user.click(screen.getByRole('button', { name: 'Sử dụng mẫu' }));

    expect(onPreviewClick).toHaveBeenCalledWith(template);
    expect(onUseTemplateClick).toHaveBeenCalledWith(template);
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
  createdAt: '2026-06-01T09:00:00',
};
