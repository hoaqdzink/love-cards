import { useEffect, useState } from 'react';

export function useScrollVisibility(): { showCtaBar: boolean; showBackToTop: boolean } {
  const [showCtaBar, setShowCtaBar] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const templatesEl = document.getElementById('templates');
    const ctaEl = document.getElementById('cta');

    const handler = () => {
      const scrollY = window.scrollY;
      const templatesBottom = (templatesEl?.offsetTop ?? 0) + (templatesEl?.offsetHeight ?? 0);
      const ctaTop = ctaEl?.offsetTop ?? 0;
      setShowCtaBar(scrollY > templatesBottom && scrollY < ctaTop - 200);
      setShowBackToTop(scrollY > 500);
    };

    window.addEventListener('scroll', handler);
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return { showCtaBar, showBackToTop };
}
