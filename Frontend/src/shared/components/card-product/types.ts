/** Cấu hình hoạt ảnh dịch preview — IX-06 */
export type CardProductAnimationConfig = {
  /** Thời lượng một chiều (vào hoặc ra), ms */
  durationMs?: number;
  /** Chuỗi easing CSS, ví dụ `ease-in-out` hoặc `cubic-bezier(...)` */
  easing?: string;
  /** Biên độ dịch dọc lên (px), số dương; áp dụng `translateY(-value)` */
  translateMaxPx?: number;
  /** Chiều cao khung iframe nội dung (px), lớn hơn vùng xem để mô phỏng “quét” trang */
  iframeContentHeightPx?: number;
};

/** Một mẫu thiệp trong danh sách — FR-02, FR-07 */
export type CardProductItem = {
  id: string;
  title: string;
  description: string;
  /** URL HTML nhúng trong iframe — FR-03 */
  previewUrl: string;
  /** Badge gợi ý (ví dụ hành vi hover) — FR-05 */
  previewHintBadge?: string;
  /** URL mở xem đầy đủ; mặc định dùng `previewUrl` nếu không có — FR-06 */
  fullViewUrl?: string;
  /** `modal` hoặc tab mới — FR-06 */
  fullViewMode?: 'modal' | 'newTab';
};

export type CardProductProps = {
  item: CardProductItem;
  animation?: CardProductAnimationConfig;
  className?: string;
};

export type CardProductGridProps = {
  items: CardProductItem[];
  animation?: CardProductAnimationConfig;
  className?: string;
};
