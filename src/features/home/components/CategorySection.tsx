export function CategorySection() {
  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 reveal">
            <span className="text-gold text-sm font-bold uppercase tracking-widest block mb-2">Phong cách</span>
            <h2 className="font-serif text-3xl font-bold text-slate mb-2">Lựa Chọn Dành Cho Bạn</h2>
            <p className="text-slate/60 max-w-xl mx-auto">Chọn phong cách phù hợp với câu chuyện tình yêu của bạn</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 reveal">
            {[
                { icon: 'ph-light ph-heart', label: 'Lãng mạn', count: '24 mẫu', color: 'group-hover:text-rose' },
                { icon: 'ph-light ph-diamond', label: 'Sang trọng', count: '18 mẫu', color: 'group-hover:text-gold' },
                { icon: 'ph-light ph-sparkle', label: 'Hiện đại', count: '32 mẫu', color: 'group-hover:text-softpink' },
                { icon: 'ph-light ph-circle', label: 'Tối giản', count: '20 mẫu', color: '' },
                { icon: 'ph-light ph-scroll', label: 'Cổ điển', count: '15 mẫu', color: 'group-hover:text-gold', hidden: true },
            ].map((cat) => (
                <a
                key={cat.label}
                href={`#templates?cat=${cat.label.toLowerCase()}`}
                className={`group flex flex-col items-center justify-center p-8 bg-cream rounded-3xl hover:bg-lightrose/50 hover:-translate-y-2 hover:shadow-card transition-all duration-300 border border-transparent hover:border-lightrose ${cat.hidden ? 'hidden md:flex' : ''}`}
                >
                <i className={`${cat.icon} text-4xl text-rose mb-4 group-hover:scale-110 transition-transform`} />
                <span className={`font-medium text-slate transition-colors ${cat.color}`}>{cat.label}</span>
                <span className="text-xs text-slate/50 mt-1">{cat.count}</span>
                </a>
            ))}
            </div>
        </div>
    </section>
  );
}