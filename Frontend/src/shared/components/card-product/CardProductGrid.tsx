import { CardProduct } from './CardProduct';
import type { CardProductGridProps } from './types';

/**
 * Lưới responsive các thẻ mẫu thiệp — FR-01, FR-07.
 */
export function CardProductGrid({ items, animation, className }: CardProductGridProps) {
  const gridClass = [
    'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <CardProduct key={item.id} item={item} animation={animation} />
      ))}
    </div>
  );
}
