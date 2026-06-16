import {
  DeviceMobile,
  Lightning,
  Palette,
  PencilSimpleLine,
  Star,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useTotalTemplateCount } from '@/features/home/hooks/useTotalTemplateCount';

const USP_ITEMS = [
  { icon: Palette, titleKey: 'home.trust.usps.design.title', descKey: 'home.trust.usps.design.desc' },
  { icon: DeviceMobile, titleKey: 'home.trust.usps.mobile.title', descKey: 'home.trust.usps.mobile.desc' },
  { icon: Lightning, titleKey: 'home.trust.usps.share.title', descKey: 'home.trust.usps.share.desc' },
  { icon: PencilSimpleLine, titleKey: 'home.trust.usps.customize.title', descKey: 'home.trust.usps.customize.desc' },
] as const;

export function BrandTrustSection() {
  const { t } = useTranslation();
  const totalTemplates = useTotalTemplateCount();
  const templateCount =
    totalTemplates > 0 ? totalTemplates.toLocaleString('vi-VN') : t('home.trust.stats.templatesFallback');

  const stats = [
    { value: `${templateCount}+`, labelKey: 'home.trust.stats.templates' },
    { value: '10.000+', labelKey: 'home.trust.stats.customers' },
    { value: '4.9/5', labelKey: 'home.trust.stats.rating', icon: Star },
    { value: t('home.trust.stats.timeValue'), labelKey: 'home.trust.stats.time' },
  ] as const;

  return (
    <section className="py-12 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = 'icon' in stat ? stat.icon : null;
            return (
              <div key={stat.labelKey} className="text-center">
                <p className="flex items-center justify-center gap-1 font-serif text-2xl font-bold text-slate sm:text-3xl">
                  {Icon ? <Icon size={22} weight="fill" className="text-gold" aria-hidden /> : null}
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate/50 sm:text-sm">
                  {t(stat.labelKey)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {USP_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.titleKey} className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-lightrose/35 text-rose">
                  <Icon size={22} weight="duotone" aria-hidden />
                </div>
                <h3 className="font-serif text-base font-bold text-slate">{t(item.titleKey)}</h3>
                <p className="mt-1 text-sm text-slate/60">{t(item.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
