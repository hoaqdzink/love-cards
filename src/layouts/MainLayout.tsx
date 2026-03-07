import { useScrollProgress, useScrollVisibility, useRevealOnScroll } from '@/shared/hooks';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const progress = useScrollProgress();
  const { showCtaBar, showBackToTop } = useScrollVisibility();
  const revealRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <Header />
      <main ref={revealRef}>{children}</main>
      <Footer />
      <div className={`cta-bar bg-white/95 backdrop-blur-xl border-t border-lightrose py-4 ${showCtaBar ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate font-medium">Sẵn sàng tạo thiệp cưới? <span className="text-rose font-semibold">Tạo trải nghiệm</span></p>
          <a href="#templates" className="px-8 py-3 bg-rose text-white rounded-full font-medium hover:bg-rose/90 shadow-soft transition-all whitespace-nowrap">Xem mẫu ngay</a>
        </div>
      </div>
      <button
        type="button"
        className={`back-to-top w-12 h-12 rounded-full bg-white shadow-card border border-lightrose flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-all ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Lên đầu trang"
      >
      </button>
    </>
  );
}
