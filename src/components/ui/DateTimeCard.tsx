interface DateTimeCardProps {
  start: string;
  end: string;
  timezone?: string;
  className?: string;
}

function formatDate(dateString: string, timezone?: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });
}

function formatTime(dateString: string, timezone?: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  });
}

export function DateTimeCard({ start, end, timezone, className }: DateTimeCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-5 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-text">Date & Time</h3>
      </div>
      <p className="text-text">{formatDate(start, timezone)}</p>
      <p className="text-text-muted">
        {formatTime(start, timezone)} - {formatTime(end, timezone)}
      </p>
    </div>
  );
}
