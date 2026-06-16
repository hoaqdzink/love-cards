import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { THEMED_COLLECTIONS } from '@/features/home/data/collections';

export function ThemedCollectionsSection() {
  const { t } = useTranslation();

  return (
    <section id="collections" className="bg-cream py-12 sm:py-16 reveal">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            {t('home.collections.eyebrow')}
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-slate">{t('home.collections.title')}</h2>
          <p className="mt-2 max-w-xl text-slate/60">{t('home.collections.description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THEMED_COLLECTIONS.map((collection) => (
            <Link
              key={collection.id}
              to={collection.catalogPath}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-lightrose shadow-card transition-transform hover:-translate-y-1 hover:shadow-soft"
            >
              <img
                src={collection.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/85 via-slate/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-serif text-lg font-bold">{t(collection.titleKey)}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/80">{t(collection.descriptionKey)}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                  {t('home.collections.explore')}
                  <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
