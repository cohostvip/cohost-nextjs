import { EventDateDisplay } from './EventDateDisplay';

interface DateTimeCardProps {
  start: string;
  end: string;
  timezone?: string;
  className?: string;
}

export function DateTimeCard({ start, end, timezone, className }: DateTimeCardProps) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border border-border bg-surface p-4 ${className || ''}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <EventDateDisplay
        start={start}
        end={end}
        tz={timezone}
        variant="full"
        className="text-text"
      />
    </div>
  );
}
