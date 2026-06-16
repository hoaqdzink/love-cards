import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTemplateCategories } from '@/features/catalog/hooks';
import type { EventType, TemplateCategory } from '@/features/catalog/types';
import { CATEGORY_IMAGES } from '@/features/home/data/categoryImages';

export function CategoryStrip() {
  const { t } = useTranslation();
  const categoriesQuery = useTemplateCategories();
  const categories = categoriesQuery.data ?? fallbackCategories();

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-5 reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            {t('home.categories.eyebrow')}
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-slate">{t('home.categories.title')}</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden reveal">
          {categories.map((category) => (
            <Link
              key={category.eventType}
              to={`/mau-thiep?event_type=${category.eventType}`}
              className="group relative h-44 w-36 shrink-0 overflow-hidden rounded-2xl border border-lightrose shadow-card transition-transform hover:-translate-y-1 hover:shadow-soft sm:h-48 sm:w-40"
            >
              <img
                src={CATEGORY_IMAGES[category.eventType as EventType]}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/80 via-slate/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="font-serif text-base font-bold leading-tight">{category.label}</p>
                <p className="mt-1 text-xs text-white/80">
                  {t('home.categories.count', { count: category.count })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function fallbackCategories(): TemplateCategory[] {
  return [
    { eventType: 'wedding', label: 'Đám cưới', count: 0 },
    { eventType: 'birthday', label: 'Sinh nhật', count: 0 },
    { eventType: 'party', label: 'Tiệc', count: 0 },
    { eventType: 'other', label: 'Khác', count: 0 },
  ];
}
