import logo from '@/assets/images/logo/result_logoAvi.png';

export function Header() {
  return (
<header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-lightrose transition-all">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    <a href="#" className="flex items-center gap-2">
      <img src={logo} alt="LoveCards - Logo" className="w-10 h-10 rounded-full object-cover flex-shrink-0 aspect-square" width={40} height={40} />
      <span className="font-serif font-bold text-2xl text-slate">LoveCards</span>
    </a>
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
      <a href="#" className="hover:text-rose transition-colors">Trang chủ</a>
      <a href="#templates" className="hover:text-rose transition-colors">Mẫu thiệp</a>
      <a href="#trending" className="hover:text-rose transition-colors">Đang hot</a>
      <a href="#gallery" className="hover:text-rose transition-colors">Bộ sưu tập</a>
      <a href="#how-it-works" className="hover:text-rose transition-colors">Giới thiệu</a>
      <a href="#testimonials" className="hover:text-rose transition-colors">Đánh giá</a>
      <a href="#footer" className="hover:text-rose transition-colors">Liên hệ</a>
    </nav>
    <a href="#templates" className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-rose text-white text-sm font-medium hover:bg-rose/90 shadow-md hover:shadow-soft transition-all duration-300">
      Xem mẫu thiệp
    </a>
  </div>
</header>
  );
}