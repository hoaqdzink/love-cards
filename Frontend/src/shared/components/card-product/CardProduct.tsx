import { useCallback, useState, type KeyboardEvent } from 'react';
import type { CardProductProps } from './types';
import { CardProductFullViewDialog } from './CardProductFullViewDialog';
import { usePrefersHoverNone } from '@/shared/hooks/usePrefersHoverNone';

const PREVIEW_FRAME_HEIGHT_PX = 280;

const defaultAnimation = {
  durationMs: 4500,
  easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  translateMaxPx: 280,
  iframeContentHeightPx: 780,
} as const;

/**
 * Thẻ mẫu thiệp: iframe preview, metadata, hover `translateY` / chạm bật tắt — LC-SPEC-CARD-001.
 */
export function CardProduct({ item, animation, className }: CardProductProps) {
  const prefersHoverNone = usePrefersHoverNone();
  const [hovered, setHovered] = useState(false);
  const [touchPreviewOn, setTouchPreviewOn] = useState(false);
  const [fullViewOpen, setFullViewOpen] = useState(false);

  const durationMs = animation?.durationMs ?? defaultAnimation.durationMs;
  const easing = animation?.easing ?? defaultAnimation.easing;
  const translateMaxPx = animation?.translateMaxPx ?? defaultAnimation.translateMaxPx;
  const iframeContentHeightPx =
    animation?.iframeContentHeightPx ?? defaultAnimation.iframeContentHeightPx;

  const previewActive = hovered || touchPreviewOn;
  const fullUrl = item.fullViewUrl ?? item.previewUrl;
  const fullMode = item.fullViewMode ?? 'modal';

  const openFullView = useCallback(() => {
    if (fullMode === 'newTab') {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setFullViewOpen(true);
  }, [fullMode, fullUrl]);

  const handleTouchToggle = () => {
    setTouchPreviewOn((v) => !v);
  };

  const handleTouchTargetKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    setTouchPreviewOn((v) => !v);
  };

  const outerClass = [
    'group/card relative flex flex-col rounded-2xl border border-lightrose bg-white p-3 shadow-card transition-[transform,box-shadow] duration-300 ease-out will-change-transform',
    'hover:-translate-y-1 hover:shadow-soft',
    previewActive ? 'ring-2 ring-rose/25 shadow-soft -translate-y-1' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const touchTargetClass = [
    'relative rounded-xl outline-none',
    prefersHoverNone ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-rose/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <article
        className={outerClass}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
        }}
      >
        {/* Vùng chạm thay hover (IX-05): tách khỏi nút “Xem đầy đủ” để tránh nút lồng nút a11y */}
        <div
          className={touchTargetClass}
          onClick={prefersHoverNone ? handleTouchToggle : undefined}
          onKeyDown={prefersHoverNone ? handleTouchTargetKeyDown : undefined}
          tabIndex={prefersHoverNone ? 0 : undefined}
          role={prefersHoverNone ? 'button' : undefined}
          aria-pressed={prefersHoverNone ? touchPreviewOn : undefined}
          aria-label={
            prefersHoverNone
              ? `${item.title}. Chạm hoặc nhấn Enter để bật hoặc tắt xem trước.`
              : undefined
          }
        >
          {item.previewHintBadge ? (
            <div className="pointer-events-none absolute left-5 top-5 z-20 max-w-[calc(100%-2.5rem)] rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate shadow-md backdrop-blur-sm">
              {item.previewHintBadge}
            </div>
          ) : null}

          {/* Vùng xem trước: cố định chiều cao, cắt overflow — FR-03, FR-04 */}
          <div
            className="relative mb-4 overflow-hidden rounded-2xl bg-lightrose/40"
            style={{ height: PREVIEW_FRAME_HEIGHT_PX }}
          >
            <div
              className="will-change-transform"
              style={{
                transform: previewActive ? `translateY(-${translateMaxPx}px)` : 'translateY(0)',
                transition: `transform ${durationMs}ms ${easing}`,
              }}
            >
              <iframe
                title={`Xem trước: ${item.title}`}
                src={item.previewUrl}
                className="block w-full border-0 bg-white pointer-events-none"
                style={{ height: iframeContentHeightPx }}
                sandbox=""
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>

          <div className="px-1 pb-1">
            <h3 className="font-serif text-xl font-bold text-slate">{item.title}</h3>
            <p className="mt-1 text-sm text-slate/60">{item.description}</p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 px-1 pt-2">
          <button
            type="button"
            onClick={() => {
              openFullView();
            }}
            className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full bg-rose px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-rose/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
          >
            Xem đầy đủ
          </button>
        </div>
      </article>

      {fullMode === 'modal' ? (
        <CardProductFullViewDialog
          open={fullViewOpen}
          onClose={() => setFullViewOpen(false)}
          src={fullUrl}
          title={item.title}
        />
      ) : null}
    </>
  );
}
