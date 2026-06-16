import { CursorClick, Palette, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

const STEPS = [
  { icon: Palette, titleKey: 'home.howItWorks.steps.choose.title', descKey: 'home.howItWorks.steps.choose.desc' },
  { icon: CursorClick, titleKey: 'home.howItWorks.steps.customize.title', descKey: 'home.howItWorks.steps.customize.desc' },
  { icon: PaperPlaneTilt, titleKey: 'home.howItWorks.steps.share.title', descKey: 'home.howItWorks.steps.share.desc' },
] as const;

function StepIcon({ icon: Icon }: { icon: (typeof STEPS)[number]['icon'] }) {
  return (
    <div className="relative mx-auto mb-5 h-[88px] w-[88px]">
      <Sparkle size={10} weight="fill" className="absolute -top-0.5 right-2 text-softpink/80" aria-hidden />
      <Sparkle size={8} weight="fill" className="absolute bottom-1 left-0 text-softpink/60" aria-hidden />
      <Sparkle size={6} weight="fill" className="absolute top-5 -left-1 text-softpink/50" aria-hidden />
      <Sparkle size={7} weight="fill" className="absolute right-0 bottom-5 text-softpink/40" aria-hidden />

      <div
        className="absolute inset-1 rounded-full bg-softpink/30 blur-md"
        aria-hidden
      />
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-[0_8px_36px_rgba(249,168,212,0.5)]">
        <Icon size={36} weight="duotone" className="text-rose" aria-hidden />
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="hidden shrink-0 items-start justify-center px-2 pt-11 md:flex" aria-hidden>
      <svg
        width="88"
        height="16"
        viewBox="0 0 88 16"
        fill="none"
        className="text-softpink/75"
      >
        <line
          x1="0"
          y1="8"
          x2="74"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
        <path
          d="M74 3.5 L84 8 L74 12.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="bg-lightrose/25 py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-14">
          <h2 className="font-serif text-3xl font-bold text-slate sm:text-4xl">
            {t('home.howItWorks.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate/55">
            {t('home.howItWorks.description')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.titleKey} className="contents">
                <div className="w-full max-w-[280px] text-center">
                  <StepIcon icon={Icon} />
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    {t('home.howItWorks.stepLabel', { step: index + 1 })}
                  </p>
                  <h3 className="mb-2 font-serif text-xl font-bold text-slate">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mx-auto max-w-[240px] text-sm leading-relaxed text-slate/55">
                    {t(step.descKey)}
                  </p>
                </div>
                {index < STEPS.length - 1 ? <StepConnector /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
