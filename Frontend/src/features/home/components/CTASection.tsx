import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTotalTemplateCount } from '@/features/home/hooks/useTotalTemplateCount';

export function CTASection() {
  const { t } = useTranslation();
  const totalTemplates = useTotalTemplateCount();
  const countLabel =
    totalTemplates > 0
      ? totalTemplates.toLocaleString('vi-VN')
      : t('home.cta.templateCountFallback');

  return (
    <section id="cta" className="px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-3xl rounded-2xl bg-lightrose/25 px-6 py-12 text-center sm:px-10 sm:py-14">
        <h2 className="font-serif text-3xl font-bold leading-tight text-slate sm:text-4xl">
          {t('home.cta.headline')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate/60">
          {t('home.cta.description', { count: countLabel })}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/mau-thiep"
            className="inline-flex min-w-[220px] justify-center rounded-full bg-rose px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-rose/90"
          >
            {t('home.cta.primary')}
          </Link>
          <a
            href="#featured"
            className="inline-flex min-w-[220px] justify-center rounded-full bg-lightrose/40 px-8 py-3.5 text-sm font-semibold text-slate transition-all hover:bg-lightrose/60 hover:text-rose"
          >
            {t('home.cta.secondary')}
          </a>
        </div>
      </div>
    </section>
  );
}
