export function TemplateCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-lightrose bg-white shadow-card">
      <div className="aspect-[3/4] bg-lightrose/50" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-3/4 rounded-full bg-lightrose/60" />
        <div className="h-3 w-full rounded-full bg-cream" />
        <div className="h-10 rounded-full bg-lightrose/40" />
      </div>
    </div>
  );
}
