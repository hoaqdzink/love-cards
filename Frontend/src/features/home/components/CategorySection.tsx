import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTemplateCategories } from '@/features/catalog/hooks';
import type { EventType, TemplateCategory } from '@/features/catalog/types';

const CATEGORY_ICONS: Record<EventType, string> = {
  wedding: 'ph-light ph-heart',
  birthday: 'ph-light ph-cake',
  party: 'ph-light ph-sparkle',
  other: 'ph-light ph-diamond',
};

export function CategorySection() {
  const { t } = useTranslation();
  const categoriesQuery = useTemplateCategories();
  const categories = categoriesQuery.data ?? fallbackCategories();

  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0 w-full">
            <div className="text-center mb-12 reveal">
            <span className="text-gold text-sm font-bold uppercase tracking-widest block mb-2">
              {t('home.categories.eyebrow')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate mb-2">{t('home.categories.title')}</h2>
            <p className="text-slate/60 max-w-xl mx-auto">{t('home.categories.description')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 min-w-0 reveal">
            {categories.map((cat) => (
                <Link
                key={cat.eventType}
                to={`/mau-thiep?event_type=${cat.eventType}`}
                className="group flex flex-col items-center justify-center p-4 sm:p-8 min-w-0 bg-cream rounded-3xl hover:bg-lightrose/50 hover:-translate-y-2 hover:shadow-card transition-all duration-300 border border-transparent hover:border-lightrose"
                >
                <i className={`${CATEGORY_ICONS[cat.eventType]} text-4xl text-rose mb-4 group-hover:scale-110 transition-transform`} />
                <span className="font-medium text-slate transition-colors group-hover:text-rose">{cat.label}</span>
                <span className="text-xs text-slate/50 mt-1">
                  {t('home.categories.count', { count: cat.count })}
                </span>
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