import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout';
import { prefetchFeaturedTemplates } from '@/features/catalog/hooks';
import { HeroSection } from '@/features/home/components/HeroSection';
import { BrandTrustSection } from '@/features/home/components/BrandTrustSection';
import { StyleCollectionsSection } from '@/features/home/components/StyleCollectionsSection';
import { FeaturedSpotlight } from '@/features/home/components/FeaturedSpotlight';
import { HowItWorksSection } from '@/features/home/components/HowItWorksSection';
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection';
import { CTASection } from '@/features/home/components/CTASection';

export function HomePage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void prefetchFeaturedTemplates(queryClient);
  }, [queryClient]);

  return (
    <MainLayout>
      <div className="bg-cream">
        <HeroSection />
        <BrandTrustSection />
        <StyleCollectionsSection />
        <FeaturedSpotlight />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </MainLayout>
  );
}
