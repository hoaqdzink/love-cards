import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { STYLE_COLLECTIONS } from '@/features/home/data/styleCollections';

export function StyleCollectionsSection() {
  const { t } = useTranslation();

  return (
    <section id="styles" className="py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            {t('home.styles.eyebrow')}
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-slate sm:text-4xl">{t('home.styles.title')}</h2>
          <p className="mt-3 text-slate/60">{t('home.styles.description')}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STYLE_COLLECTIONS.map((style) => (
            <Link
              key={style.id}
              to={style.catalogPath}
              className="group relative aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-xl shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg sm:w-52 lg:w-auto"
            >
              <img
                src={style.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/25 to-slate/5" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-serif text-lg font-bold leading-tight">{t(style.titleKey)}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/75">{t(style.descriptionKey)}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                  {t('home.styles.explore')}
                  <ArrowRight size={12} weight="bold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
