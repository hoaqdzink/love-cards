export function CTASection() {
  return (
    <section id="cta" className="py-12 px-6 reveal">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-lightrose via-rose/10 to-gold/20 rounded-[3rem] p-1 shadow-soft border border-lightrose">
            <div className="bg-white/95 backdrop-blur-sm rounded-[2.9rem] p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate mb-6">Tìm mẫu thiệp cưới hoàn hảo cho ngày trọng đại của bạn</h2>
            <p className="text-slate/60 text-lg mb-2 max-w-xl mx-auto font-light">Tạo trải nghiệm • Không cần thẻ tín dụng</p>
            <p className="text-sm text-slate/50 mb-10">Nhận 10 mẫu thiệp hot mỗi tuần qua email</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="#templates" className="inline-block px-10 py-4 bg-rose text-white text-base font-medium rounded-full hover:bg-rose/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">Khám phá các mẫu thiệp</a>
                <form className="flex gap-2 w-full sm:w-auto max-w-md sm:max-w-none" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email của bạn" className="flex-1 px-5 py-3 rounded-full border border-lightrose focus:outline-none focus:ring-2 focus:ring-rose/30 text-sm" />
                <button type="submit" className="px-6 py-3 bg-gold text-white rounded-full font-medium text-sm hover:bg-gold/90 transition-colors whitespace-nowrap">Nhận mẫu</button>
                </form>
            </div>
            </div>
        </div>
    </section>
  );
}