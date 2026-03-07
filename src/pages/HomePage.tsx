import { MainLayout } from '@/layouts/MainLayout';
import { HeroSection } from '@/features/home/components/HeroSection';
import { CategorySection } from '@/features/home/components/CategorySection';
import { TemplateSection } from '@/features/home/components/TemplateSection';
import { TrendingSection } from '@/features/home/components/TrendingSection';
import { HowItWorksSection } from '@/features/home/components/HowItWorksSection';
import { GallerySection } from '@/features/home/components/GallerySection';
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection';
import { CTASection } from '@/features/home/components/CTASection';

export function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      <TemplateSection />
      <TrendingSection />
      <HowItWorksSection />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
}