import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CatalogPagination } from './CatalogPagination';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'catalog.pagination.label': 'Phân trang danh mục',
        'catalog.pagination.previous': 'Trước',
        'catalog.pagination.next': 'Sau',
      })[key] ?? key,
  }),
}));

describe('CatalogPagination', () => {
  it('does not render when there is only one page', () => {
    const { container } = render(
      <CatalogPagination currentPage={0} totalPages={1} hasPrevious={false} hasNext={false} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders page controls and emits page changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <CatalogPagination
        currentPage={1}
        totalPages={3}
        hasPrevious
        hasNext
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Phân trang danh mục' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Trước' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: 'Sau' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 0);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 2);
  });
});
