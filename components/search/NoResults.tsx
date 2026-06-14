interface NoResultsProps {
  query: string;
}

export function NoResults({ query }: NoResultsProps) {
  return (
    <div className="text-center py-16 sm:py-20">
      <div className="text-5xl sm:text-6xl mb-4">🔍</div>
      <h3 className="font-display text-xl sm:text-2xl tracking-wider text-foreground mb-2">
        No Results
      </h3>
      <p className="text-muted-foreground text-sm">
        We couldn’t find anything matching “{query}”.
      </p>
    </div>
  );
}