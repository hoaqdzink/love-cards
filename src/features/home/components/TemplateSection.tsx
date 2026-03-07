export function TemplateSection() {
  return (
    <section id="templates" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12 reveal">
            <div>
                <h2 className="font-serif text-4xl font-bold text-slate">Mẫu Thiệp Nổi Bật</h2>
                <p className="text-slate/60 mt-2">Khám phá các thiết kế được yêu thích nhất mùa cưới này.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <select className="px-4 py-2 rounded-full border border-lightrose bg-white text-sm text-slate focus:outline-none focus:ring-2 focus:ring-rose/20">
                <option>Tất cả phong cách</option>
                </select>
                <a href="#" className="text-rose font-medium hover:text-rose/80 transition-colors flex items-center gap-1">
                Xem tất cả <i className="ph ph-arrow-right" />
                </a>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
            {/* Lặp qua data templates */}
            <div className="group bg-white rounded-3xl p-3 shadow-card hover:shadow-soft hover:-translate-y-2 transition-all duration-500 border border-lightrose relative">
                <div className="absolute top-6 left-6 z-10 bg-rose text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">🔥 Trending</div>
                <div className="relative h-72 rounded-2xl overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Peony Dream" loading="lazy" />
                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center">
                    <button className="px-6 py-2.5 bg-rose text-white rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">Xem mẫu</button>
                </div>
                </div>
                <div className="px-3 pb-3">
                <h3 className="font-serif text-xl font-bold text-slate mb-1 group-hover:text-rose transition-colors">Peony Dream</h3>
                <p className="text-sm text-slate/50">Lãng mạn • 2.4k lượt dùng</p>
                </div>
            </div>
            {/* ... các card khác tương tự */}
            </div>
        </div>
        </section>
  );
}