import { useUIStore } from '@/app/store/useUIStore';

export function ToastViewport() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed right-4 top-24 z-[1200] flex w-[min(100%-2rem,22rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          className={`rounded-2xl border px-4 py-3 text-left text-sm shadow-card transition-transform hover:-translate-y-0.5 ${
            toast.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : toast.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-lightrose bg-white text-slate'
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
