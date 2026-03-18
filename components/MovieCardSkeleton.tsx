export function MovieCardSkeleton() {
  return (
    <div className="shrink-0 w-35 sm:w-40 md:w-45">
      <div className="aspect-2/3 rounded-xl shimmer-bg" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3.5 w-3/4 rounded shimmer-bg" />
        <div className="h-3 w-1/2 rounded shimmer-bg" />
      </div>
    </div>
  );
}
