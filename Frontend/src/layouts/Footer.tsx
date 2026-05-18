import logo from '@/assets/images/logo/result_logoAvi.png';

export function Footer() {
  return (
    <footer id="footer" className="bg-slate text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="LoveCards" className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
            <span className="font-serif font-bold text-xl">LoveCards</span>
            </div>
            <p className="text-white/70 text-sm font-light leading-relaxed">Nền tảng thiệp cưới trực tuyến chuyên nghiệp...</p>
            <div className="flex gap-2 pt-2">
            <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">🔒 Bảo mật</span>
            <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">✓ Hỗ trợ 24/7</span>
            </div>
        </div>
        <div>
            <h4 className="font-bold text-softpink mb-6 text-sm uppercase tracking-wider">Khám Phá</h4>
            <ul className="space-y-3 text-sm text-white/70 font-light">
            <li><a href="#templates" className="hover:text-softpink transition-colors">Mẫu thiệp cưới</a></li>
            <li><a href="#trending" className="hover:text-softpink transition-colors">Đang thịnh hành</a></li>
            <li><a href="#gallery" className="hover:text-softpink transition-colors">Bộ sưu tập</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-softpink mb-6 text-sm uppercase tracking-wider">Liên Hệ</h4>
            <ul className="space-y-3 text-sm text-white/70 font-light">
            <li>📧 contact@lovecards.vn</li>
            <li>📞 03999 89 849</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-softpink mb-6 text-sm uppercase tracking-wider">Kết Nối</h4>
            <div className="flex gap-4 text-white/50 text-2xl">
            <a href="#" className="hover:text-softpink transition-colors"><i className="ph-fill ph-instagram-logo" /></a>
            <a href="#" className="hover:text-softpink transition-colors"><i className="ph-fill ph-facebook-logo" /></a>
            <a href="#" className="hover:text-softpink transition-colors"><i className="ph-fill ph-pinterest-logo" /></a>
            </div>
        </div>
        </div>
        <div className="text-center text-white/50 text-sm border-t border-white/20 pt-8 font-light">
        © 2026 LoveCards. Thiết kế dành cho tình yêu.
        </div>
    </footer>
  );
}