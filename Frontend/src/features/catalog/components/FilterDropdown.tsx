import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CaretDown } from '@phosphor-icons/react';

type FilterDropdownProps = {
  label: string;
  activeCount?: number;
  children: ReactNode;
  className?: string;
};

export function FilterDropdown({ label, activeCount = 0, children, className }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const isActive = activeCount > 0;

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className ?? ''}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/30 ${
          isActive
            ? 'border-rose bg-rose/10 text-rose'
            : 'border-lightrose bg-white text-slate hover:bg-cream'
        }`}
      >
        <span>{label}</span>
        {isActive ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1.5 text-xs font-semibold text-white">
            {activeCount}
          </span>
        ) : null}
        <CaretDown size={14} weight="bold" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[220px] max-w-[min(90vw,320px)] rounded-2xl border border-lightrose bg-white p-3 shadow-soft"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
