import { CaretUp } from '@phosphor-icons/react';
import { useScrollProgress, useScrollVisibility, useRevealOnScroll } from '@/shared/hooks';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ToastViewport } from '@/shared/components/ToastViewport';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const progress = useScrollProgress();
  const { showBackToTop } = useScrollVisibility();
  const revealRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <Header />
      <main ref={revealRef}>{children}</main>
      <Footer />
      <ToastViewport />
      
      <button
        type="button"
        className={`back-to-top w-12 h-12 rounded-full bg-white shadow-card border border-lightrose flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-all ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Lên đầu trang"
      >
        <CaretUp size={24} weight="bold" />
      </button>
    </>
  );
}
