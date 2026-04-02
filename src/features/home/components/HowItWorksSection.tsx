export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-24 reveal">
            <div className="text-center mb-16">
                <h2 className="font-serif text-4xl font-bold text-slate mb-4">Quy Trình Tạo Thiệp</h2>
                <p className="text-slate/60 max-w-xl mx-auto">Chỉ với 3 bước đơn giản, bạn đã có ngay một tấm thiệp cưới điện tử mang đậm dấu ấn cá nhân.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[16%] w-[68%] h-[2px] border-t-2 border-dashed border-lightrose z-0" />
                {[
                { icon: 'ph-palette', title: '1. Chọn phong cách', desc: 'Lựa chọn từ hàng trăm mẫu thiệp đa dạng phù hợp với concept lễ cưới.' },
                { icon: 'ph-cursor-click', title: '2. Xem và tùy chỉnh', desc: 'Thay đổi thông tin, hình ảnh, âm nhạc để tạo ra lời mời của riêng bạn.', mt: true },
                { icon: 'ph-paper-plane-right', title: '3. Chia sẻ nhanh chóng', desc: 'Gửi link thiệp qua Zalo, Messenger, SMS cho bạn bè và gia đình tức thì.' },
                ].map((step) => (
                <div key={step.title} className={`relative z-10 bg-white p-8 rounded-3xl text-center shadow-card border border-lightrose hover:border-rose/30 transition-colors group ${step.mt ? 'mt-0 md:mt-8' : ''}`}>
                    <div className="w-16 h-16 mx-auto rounded-full bg-white text-rose flex items-center justify-center text-2xl mb-6 shadow-md border border-lightrose group-hover:scale-110 transition-transform">
                    <i className={`ph ${step.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate mb-2">{step.title}</h3>
                    <p className="text-sm text-slate/60 mb-6">{step.desc}</p>
                </div>
                ))}
            </div>
            </div>
            <div className="bg-white rounded-[3rem] p-12 lg:p-16 border border-lightrose reveal">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                { icon: 'ph-light ph-images', label: '200+ Mẫu Đẹp', desc: 'Cập nhật xu hướng liên tục', color: 'text-gold' },
                { icon: 'ph-light ph-magic-wand', label: 'Tạo Trong 5 Phút', desc: 'Kéo thả tùy chỉnh trực quan', color: 'text-rose' },
                { icon: 'ph-light ph-rocket-launch', label: 'Chia Sẻ Tức Thì', desc: 'Zalo, Messenger chỉ 1 giây', color: 'text-gold' },
                { icon: 'ph-light ph-device-mobile', label: '100% Mobile', desc: 'Hiển thị hoàn hảo mọi thiết bị', color: 'text-rose' },
                ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-4 group">
                    <div className={`w-14 h-14 rounded-2xl bg-cream ${item.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={item.icon} />
                    </div>
                    <div>
                    <h4 className="font-bold text-slate">{item.label}</h4>
                    <p className="text-xs text-slate/50 mt-1">{item.desc}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    </section>
  );
}