import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import logo from '@/assets/images/logo/result_logoAvi.png';

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/mau-thiep', label: 'Mẫu thiệp' },
  { href: '#trending', label: 'Đang hot' },
  { href: '#gallery', label: 'Bộ sưu tập' },
  { href: '#how-it-works', label: 'Giới thiệu' },
  { href: '#testimonials', label: 'Đánh giá' },
  { href: '#footer', label: 'Liên hệ' },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  const mobileMenu =
    menuOpen && typeof document !== 'undefined'
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[1080] bg-slate/40 lg:hidden cursor-default"
              aria-label="Đóng menu"
              onClick={closeMenu}
            />
            <div
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu điều hướng"
              className="fixed top-0 right-0 bottom-0 z-[1090] w-[min(100%,20rem)] bg-white shadow-2xl border-l border-lightrose lg:hidden flex flex-col pt-[4.5rem] sm:pt-24 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
            >
              <button
                type="button"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center justify-center w-11 h-11 rounded-xl border border-lightrose text-slate hover:bg-lightrose/50 hover:text-rose transition-colors"
                aria-label="Đóng menu"
                onClick={closeMenu}
              >
                <X size={24} weight="bold" />
              </button>
              <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain px-4 py-4 gap-1 min-h-0">
                <nav className="flex flex-col gap-1" aria-label="Liên kết trang">
                  {NAV_LINKS.map(({ href, label }) =>
                    href.startsWith('/') ? (
                      <Link
                        key={href}
                        to={href}
                        className="py-3 px-3 rounded-lg text-slate font-medium hover:bg-lightrose/60 hover:text-rose transition-colors"
                        onClick={closeMenu}
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        key={href}
                        href={href}
                        className="py-3 px-3 rounded-lg text-slate font-medium hover:bg-lightrose/60 hover:text-rose transition-colors"
                        onClick={closeMenu}
                      >
                        {label}
                      </a>
                    ),
                  )}
                </nav>
                <Link
                  to="/mau-thiep"
                  className="mt-6 mx-1 py-3 text-center rounded-full bg-rose text-white text-sm font-medium hover:bg-rose/90 shadow-md transition-colors"
                  onClick={closeMenu}
                >
                  Xem mẫu thiệp
                </Link>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1100] bg-white/90 backdrop-blur-xl border-b border-lightrose transition-all supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 min-w-0">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 min-w-0 flex-shrink-0 touch-manipulation"
          >
            <img
              src={logo}
              alt="LoveCards - Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 aspect-square"
              width={40}
              height={40}
            />
            <span className="font-serif font-bold text-lg sm:text-2xl text-slate truncate">
              LoveCards
            </span>
          </Link>

          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-8 text-sm font-medium text-slate"
            aria-label="Chính"
          >
            {NAV_LINKS.map(({ href, label }) =>
              href.startsWith('/') ? (
                <Link key={href} to={href} className="hover:text-rose transition-colors whitespace-nowrap">
                  {label}
                </Link>
              ) : (
                <a key={href} href={href} className="hover:text-rose transition-colors whitespace-nowrap">
                  {label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to="/mau-thiep"
              onClick={closeMenu}
              className="hidden lg:inline-flex px-4 xl:px-6 py-2 sm:py-2.5 rounded-full bg-rose text-white text-sm font-medium hover:bg-rose/90 shadow-md hover:shadow-soft transition-all duration-300 whitespace-nowrap"
            >
              Xem mẫu thiệp
            </Link>

            <button
              type="button"
              className="lg:hidden relative z-[1] inline-flex items-center justify-center w-11 h-11 rounded-xl border border-lightrose text-slate bg-white/90 hover:bg-lightrose/50 hover:text-rose transition-colors touch-manipulation"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
            >
              {menuOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
            </button>
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
