import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroMockup from '@/assets/images/logo/introduce.png';
import { useTotalTemplateCount } from '@/features/home/hooks/useTotalTemplateCount';

export function HeroSection() {
  const { t } = useTranslation();
  const totalTemplates = useTotalTemplateCount();
  const templateCount =
    totalTemplates > 0 ? totalTemplates.toLocaleString('vi-VN') : '200';

  return (
    <section className="relative flex min-h-[min(70vh,680px)] items-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="pointer-events-none absolute top-20 left-10 h-72 w-72 rounded-full bg-softpink/25 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
        <div className="max-w-xl space-y-5 animate-load">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-lightrose/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              {t('home.hero.badge')}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold leading-tight text-slate sm:text-4xl lg:text-5xl">
            {t('home.hero.title')}
            <span className="mt-1 block font-normal italic text-rose">{t('home.hero.titleAccent')}</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-slate/70 sm:text-lg">
            {t('home.hero.description')}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/mau-thiep"
              className="inline-flex rounded-full bg-rose px-8 py-3.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-rose/90 hover:shadow-soft"
            >
              {t('home.hero.ctaPrimary')}
            </Link>
            <a
              href="#featured"
              className="inline-flex rounded-full bg-lightrose/30 px-8 py-3.5 text-sm font-medium text-slate transition-all hover:bg-lightrose/50 hover:text-rose"
            >
              {t('home.hero.ctaSecondary')}
            </a>
          </div>

          <p className="text-sm text-slate/50">
            {t('home.hero.trustLine', {
              count: templateCount,
              rating: t('home.testimonials.rating'),
              customers: t('home.hero.trustCustomers'),
            })}
          </p>
        </div>

        <div className="hidden animate-load justify-center md:flex" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-white/60 via-gold/20 to-rose/10 blur-2xl" />
            <img
              src={heroMockup}
              className="relative max-h-[360px] w-auto max-w-[400px] rounded-xl drop-shadow-2xl animate-floating"
              alt={t('home.hero.imageAlt')}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
