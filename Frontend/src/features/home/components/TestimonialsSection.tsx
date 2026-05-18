const testimonials = [
  {
    quote:
      '"Giao diện web rất đẹp, tạo thiệp siêu nhanh mà lại rất sang. Mình gửi cho họ hàng lớn tuổi ai cũng khen vì thiệp rõ ràng, dễ đọc trên điện thoại."',
    name: 'Minh Anh',
    role: 'Cô dâu',
    date: 'Cưới 15.10.2025',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
  },
  {
    quote:
      '"Rất chuyên nghiệp! Các tính năng kéo thả trên nền tảng y như đang dùng Canva nhưng được tối ưu riêng cho ngành cưới. Cực kỳ recommend!"',
    name: 'Tuấn Kiệt',
    role: 'Chú rể',
    date: 'Cưới 22.09.2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  },
  {
    quote:
      '"Mình thích nhất mẫu thiệp lãng mạn tone hồng ở đây. Làm xong gửi bạn bè đứa nào cũng hỏi xin link web để mốt tụi nó cưới dùng luôn."',
    name: 'Bảo Châu',
    role: 'Cô dâu',
    date: 'Cưới 01.11.2025',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-cream reveal">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate mb-2">
            Trải Nghiệm Từ Khách Hàng
          </h2>
          <p className="text-slate/60">
            4.9/5 từ <strong className="text-slate">2.341</strong> đánh giá
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white p-8 rounded-[2rem] border border-lightrose shadow-card relative hover:shadow-soft hover:-translate-y-1 transition-all"
            >
              <div className="flex text-gold mb-4 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ph-fill ph-star" />
                ))}
              </div>
              <p className="text-slate/70 text-sm mb-8 font-light leading-relaxed">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  alt={t.name}
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate">{t.name}</h4>
                  <p className="text-xs text-slate/50">
                    {t.role} • {t.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
