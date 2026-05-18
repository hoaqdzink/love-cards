import { useEffect, useRef } from 'react';

type CardProductFullViewDialogProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  title: string;
};

/**
 * Modal xem đầy đủ HTML mẫu — FR-06.
 * Dùng phần tử `<dialog>` để hỗ trợ đóng bằng Escape và semantics.
 */
export function CardProductFullViewDialog({
  open,
  onClose,
  src,
  title,
}: CardProductFullViewDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDialogClose = () => onClose();
    el.addEventListener('close', onDialogClose);
    return () => el.removeEventListener('close', onDialogClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="card-product-fullview-title"
      className="fixed left-1/2 top-1/2 z-[200] w-[min(96vw,1100px)] max-h-[min(92vh,900px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-lightrose bg-white p-0 shadow-2xl backdrop:bg-slate/40 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between gap-3 border-b border-lightrose px-4 py-3">
        <h2 id="card-product-fullview-title" className="font-serif text-lg font-semibold text-slate truncate pr-2">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => {
            ref.current?.close();
          }}
          className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate hover:bg-lightrose/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/30"
        >
          Đóng
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-cream p-3 sm:p-4">
        <iframe
          title={title}
          src={src}
          className="h-[min(75vh,720px)] w-full rounded-xl border-0 bg-white"
          sandbox=""
          loading="lazy"
        />
      </div>
    </dialog>
  );
}
