interface LocationCardProps {
  name: string;
  address?: string;
  className?: string;
}

export function LocationCard({ name, address, className }: LocationCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-5 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="font-semibold text-text">Location</h3>
      </div>
      <p className="text-text">{name}</p>
      {address && (
        <p className="text-sm text-text-muted">{address}</p>
      )}
    </div>
  );
}
