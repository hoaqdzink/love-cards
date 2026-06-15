import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterPanel } from '../../components/FilterPanel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'catalog.filters.title': 'Bộ lọc',
        'catalog.filters.reset': 'Đặt lại',
        'catalog.filters.eventType': 'Loại sự kiện',
        'catalog.filters.color': 'Màu sắc',
        'catalog.filters.events.wedding': 'Đám cưới',
        'catalog.filters.events.birthday': 'Sinh nhật',
        'catalog.filters.events.party': 'Tiệc',
        'catalog.filters.events.other': 'Khác',
        'catalog.filters.colors.pink': 'Hồng',
        'catalog.filters.colors.white': 'Trắng',
        'catalog.filters.colors.gold': 'Vàng',
        'catalog.filters.colors.blue': 'Xanh dương',
        'catalog.filters.colors.purple': 'Tím',
        'catalog.filters.colors.green': 'Xanh lá',
        'catalog.filters.colors.red': 'Đỏ',
        'catalog.sort.label': 'Sắp xếp',
        'catalog.sort.popular': 'Phổ biến',
        'catalog.sort.newest': 'Mới nhất',
        'catalog.sort.priceAsc': 'Giá tăng dần',
        'catalog.sort.priceDesc': 'Giá giảm dần',
      })[key] ?? key,
  }),
}));

describe('FilterPanel', () => {
  it('shows selected filters with pressed state', () => {
    renderFilterPanel();

    expect(screen.getByRole('button', { name: 'Đám cưới' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Hồng' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('combobox', { name: /sắp xếp/i })).toHaveValue('newest');
  });

  it('dispatches event, color, sort and reset changes', async () => {
    const user = userEvent.setup();
    const handlers = renderFilterPanel();

    await user.click(screen.getByRole('button', { name: 'Sinh nhật' }));
    await user.click(screen.getByRole('button', { name: 'Trắng' }));
    await user.selectOptions(screen.getByRole('combobox', { name: /sắp xếp/i }), 'price_asc');
    await user.click(screen.getByRole('button', { name: 'Đặt lại' }));

    expect(handlers.onToggleEvent).toHaveBeenCalledWith('birthday');
    expect(handlers.onToggleColor).toHaveBeenCalledWith('white');
    expect(handlers.onSortChange).toHaveBeenCalledWith('price_asc');
    expect(handlers.onReset).toHaveBeenCalledTimes(1);
  });
});

function renderFilterPanel() {
  const handlers = {
    onToggleEvent: vi.fn(),
    onToggleColor: vi.fn(),
    onSortChange: vi.fn(),
    onReset: vi.fn(),
  };

  render(
    <FilterPanel
      selectedEvents={['wedding']}
      selectedColors={['pink']}
      sort="newest"
      {...handlers}
    />,
  );

  return handlers;
}
