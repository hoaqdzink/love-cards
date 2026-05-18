import { CardProductGrid } from '@/shared/components/card-product';
import { featuredCardProducts } from '@/features/home/data/cardProducts';

const templatePreviewAnimation = {
  durationMs: 5000,
  easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  translateMaxPx: 300,
  iframeContentHeightPx: 800,
} as const;

export function TemplateSection() {
  return (
    <section id="templates" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12 reveal">
          <div>
            <h2 className="font-serif text-4xl font-bold text-slate">Mẫu Thiệp Nổi Bật</h2>
            <p className="text-slate/60 mt-2">Khám phá các thiết kế được yêu thích nhất mùa cưới này.</p>
            <p className="mt-2 text-xs text-slate/50 max-w-xl">
              Trên điện thoại: chạm vào vùng xem trước hoặc phần tiêu đề/mô tả để bật/tắt hiệu ứng
              (thay cho hover chuột).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="px-4 py-2 rounded-full border border-lightrose bg-white text-sm text-slate focus:outline-none focus:ring-2 focus:ring-rose/20">
              <option>Tất cả phong cách</option>
            </select>
            <a href="#" className="text-rose font-medium hover:text-rose/80 transition-colors flex items-center gap-1">
              Xem tất cả <i className="ph ph-arrow-right" />
            </a>
          </div>
        </div>

        <CardProductGrid items={featuredCardProducts} animation={templatePreviewAnimation} className="reveal" />
      </div>
    </section>
  );
}
