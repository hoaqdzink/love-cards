import { useMemo, useState } from 'react';
import { Star } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

type TestimonialItem = {
  id: string;
  quoteKey: string;
  nameKey: string;
  roleKey: string;
  avatar: string;
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'minh-anh',
    quoteKey: 'home.testimonials.items.minhAnh.quoteShort',
    nameKey: 'home.testimonials.items.minhAnh.name',
    roleKey: 'home.testimonials.items.minhAnh.role',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'tuan-kiet',
    quoteKey: 'home.testimonials.items.tuanKiet.quoteShort',
    nameKey: 'home.testimonials.items.tuanKiet.name',
    roleKey: 'home.testimonials.items.tuanKiet.role',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'bao-chau',
    quoteKey: 'home.testimonials.items.baoChau.quoteShort',
    nameKey: 'home.testimonials.items.baoChau.name',
    roleKey: 'home.testimonials.items.baoChau.role',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'thu-ha',
    quoteKey: 'home.testimonials.items.thuHa.quoteShort',
    nameKey: 'home.testimonials.items.thuHa.name',
    roleKey: 'home.testimonials.items.thuHa.role',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
];

function Stars() {
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 text-gold" aria-hidden>
      {[...Array(5)].map((_, index) => (
        <Star key={index} size={12} weight="fill" />
      ))}
    </span>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const { t } = useTranslation();

  return (
    <article className="w-[260px] shrink-0 rounded-xl bg-lightrose/25 px-4 py-3.5 sm:w-[280px]">
      <div className="mb-2 flex items-center gap-2">
        <Stars />
        <span className="truncate text-sm font-semibold text-slate">{t(item.nameKey)}</span>
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-slate/70">{t(item.quoteKey)}</p>
      <div className="mt-3 flex items-center gap-2 pt-3">
        <img
          src={item.avatar}
          alt=""
          loading="lazy"
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <p className="line-clamp-1 text-xs text-slate/50">{t(item.roleKey)}</p>
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);

  const marqueeItems = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS], []);

  return (
    <section id="testimonials" className="py-14 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <header className="mb-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate sm:text-3xl">{t('home.testimonials.title')}</h2>
          <p className="mt-2 text-sm text-slate/60">
            {t('home.testimonials.subtitle', {
              rating: t('home.testimonials.rating'),
              total: t('home.testimonials.totalReviews'),
            })}
          </p>
        </header>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-label={t('home.testimonials.marqueeLabel')}
        >
          <div className={`testimonial-marquee-track flex w-max gap-4 ${paused ? 'is-paused' : ''}`}>
            {marqueeItems.map((item, index) => (
              <TestimonialCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
