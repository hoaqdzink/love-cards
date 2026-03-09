const galleryImages: { src: string; label?: string }[] = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop', label: 'Mẫu Peony Dream' },
  { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop' },
  { src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600&auto=format&fit=crop' },
  { src: 'https://tiff.vn/wp-content/uploads/2025/03/DECOR-5.jpg' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop' },
  { src: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600&auto=format&fit=crop' },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-cream reveal">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-serif text-4xl font-bold text-slate mb-12 text-center">Thư Viện Cảm Hứng</h2>
            <div className="masonry">
            {galleryImages.map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className={img.label ? 'rounded-3xl overflow-hidden hover:opacity-90 hover:shadow-lg transition-all group relative' : 'rounded-3xl overflow-hidden hover:opacity-90 hover:shadow-lg transition-all'}
                >
                  <img src={img.src} className="w-full h-auto" alt="Gallery" loading="lazy" />
                  {img.label && (
                    <div className="absolute inset-0 bg-slate/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                      <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-slate shadow-md">{img.label}</span>
                    </div>
                  )}
                </div>
            ))}
            </div>
        </div>
    </section>
  );
}