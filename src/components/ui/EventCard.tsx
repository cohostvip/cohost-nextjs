import Link from 'next/link';
import type { EventProfile } from '@/lib/api';
import { resolveEventUrl } from '@/lib/routes';

interface EventCardProps {
  event: EventProfile;
}

function formatDate(dateString: string, timezone?: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={resolveEventUrl(event)}
      className="group block overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-border-hover hover:bg-surface-elevated"
    >
      <div className="relative aspect-square overflow-hidden">
        {event.flyer?.url ? (
          <img
            src={event.flyer.url}
            alt={event.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
            <span className="text-text-subtle">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm font-medium text-primary">
          {formatDate(event.start, event.tz)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-text group-hover:text-primary">
          {event.name}
        </h3>
        {event.location?.name && (
          <p className="mt-1 line-clamp-1 text-sm text-text-muted">
            {event.location.name}
            {event.location.address?.city && `, ${event.location.address.city}`}
          </p>
        )}
        {event.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-text-subtle">
            {event.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
