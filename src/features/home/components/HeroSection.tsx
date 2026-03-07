// Thay bằng import heroMockup from '@/assets/images/logo/Gemini_Generated_Image_tn5ff3tn5ff3tn5f.png' khi đã thêm file ảnh
import heroMockup from '@/assets/images/logo/introduce.png';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-lightrose via-cream to-white">
        <div className="absolute top-20 left-10 w-72 h-72 bg-softpink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10 animate-load">
            <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-lightrose text-gold text-xs font-semibold uppercase tracking-widest shadow-sm">
                ✨ Mùa cưới 2026
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-slate/60">
                <i className="ph-fill ph-users-three text-rose" />
                <strong className="text-slate">10.000+</strong> cặp đôi tin dùng
                </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight text-slate">
                Khám phá những mẫu thiệp cưới <br />
                <span className="italic font-normal text-rose">đẹp và tinh tế</span>
            </h1>
            <p className="text-lg text-slate/70 max-w-md leading-relaxed font-light">
                Tạo dấu ấn riêng cho ngày trọng đại với những thiết kế sang trọng, dễ dàng tùy chỉnh và chia sẻ niềm vui đến người thân chỉ trong vài thao tác.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
                <a href="#templates" className="px-8 py-4 rounded-full bg-rose text-white font-medium hover:bg-rose/90 hover:shadow-soft hover:-translate-y-1 transition-all">
                Xem các mẫu thiệp
                </a>
                <a href="#gallery" className="px-8 py-4 rounded-full bg-white text-slate font-medium border border-lightrose hover:border-gold hover:text-gold transition-all shadow-sm">
                Khám phá bộ sưu tập
                </a>
            </div>
            <div className="pt-6 border-t border-lightrose mt-8">
                <p className="text-sm text-slate/60 leading-relaxed">
                Thiệp cưới điện tử giúp bạn tiết kiệm chi phí in ấn, gửi tới mọi người chỉ với một link. Khách mời mở thiệp trên điện thoại, máy tính đều đẹp mắt, chuyên nghiệp.
                </p>
            </div>
            </div>

            <div className="relative z-10 hidden md:flex justify-center items-center animate-load" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-white/60 via-gold/20 to-rose/10 rounded-2xl blur-2xl" />
                <div className="absolute -inset-px bg-gradient-to-br from-white/80 via-transparent to-white/40 rounded-xl" />
                <img
                src={heroMockup}
                className="relative max-w-[560px] w-full h-auto rounded-xl animate-floating drop-shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(255,255,255,0.3), 0 0 100px rgba(201,162,39,0.15)' }}
                alt="Thiệp cưới mẫu"
                />
            </div>
            </div>
        </div>
    </section>
  );
}