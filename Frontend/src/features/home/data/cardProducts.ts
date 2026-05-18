import type { CardProductItem } from '@/shared/components/card-product';

/**
 * Dữ liệu mẫu cho mục "Mẫu thiệp" — FR-07 (tách khỏi component).
 * `previewUrl` trỏ tới HTML tĩnh trong `public/card-previews/`.
 */
export const featuredCardProducts: CardProductItem[] = [
  {
    id: 'peony-dream',
    title: 'Peony Dream',
    description: 'Lãng mạn, hồng pastel • 2.4k lượt dùng',
    previewUrl: '/card-previews/peony-dream.html',
    previewHintBadge: 'Di chuột để xem thêm',
    fullViewMode: 'modal',
  },
  {
    id: 'rose-garden',
    title: 'Rose Garden',
    description: 'Tối sang trọng, nhấn vàng • Mới',
    previewUrl: '/card-previews/rose-garden.html',
    previewHintBadge: 'Di chuột để xem thêm',
    fullViewMode: 'modal',
  },
  {
    id: 'minimal-blush',
    title: 'Minimal Blush',
    description: 'Tối giản, chữ serif tinh tế',
    previewUrl: '/card-previews/minimal-blush.html',
    previewHintBadge: 'Di chuột để xem thêm',
    fullViewMode: 'newTab',
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour',
    description: 'Ấm áp, tông vàng hoàng hôn',
    previewUrl: '/card-previews/golden-hour.html',
    previewHintBadge: 'Di chuột để xem thêm',
    fullViewMode: 'modal',
  },
];
