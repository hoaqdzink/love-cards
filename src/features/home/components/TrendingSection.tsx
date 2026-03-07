export function TrendingSection() {
  return (
    <section id="trending" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lightrose/60 text-rose text-sm font-bold">
                <i className="ph-fill ph-trend-up pulse-dot" /> Đang thịnh hành
            </span>
            <span className="text-sm text-slate/50">Cập nhật mỗi ngày</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8 reveal">
            {[
                { img: '...', title: 'Blush Dream', count: '12.5k', badge: { type: 'live', text: '12 đang xem' } },
                { img: '...', title: 'Soft Ivory', count: '9.2k', badge: { type: 'live', text: '8 đang xem' } },
                { img: '...', title: 'Botanical Love', count: '8.7k', badge: { type: 'sale', text: 'Giảm 20% tuần này' } },
            ].map((item) => (
                <article key={item.title} className="group bg-cream rounded-3xl p-4 border border-lightrose relative overflow-hidden hover:shadow-soft hover:-translate-y-2 transition-all">
                <div className="absolute top-4 right-4 z-10 ...">
                    {item.badge.type === 'live' && (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" /> {item.badge.text}
                    </span>
                    )}
                    {item.badge.type === 'sale' && (
                    <span className="bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-full">{item.badge.text}</span>
                    )}
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} loading="lazy" />
                    <span className="absolute bottom-3 left-3 bg-slate/80 text-white text-xs px-3 py-1 rounded-full">{item.count} lượt dùng</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate mb-1">{item.title}</h3>
                <a href="#templates" className="inline-flex items-center gap-2 text-rose text-sm font-medium hover:gap-3 transition-all">Xem mẫu <i className="ph ph-arrow-right" /></a>
                </article>
            ))}
            </div>
        </div>
    </section>
  );
}