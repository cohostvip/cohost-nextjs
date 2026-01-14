import { EventCard } from '@/components/ui';
import type { EventProfile } from '@/lib/api';

interface EventsGridProps {
  events: EventProfile[];
  title?: string;
  emptyMessage?: string;
}

export function EventsGrid({
  events,
  title = 'All Events',
  emptyMessage = 'No events found',
}: EventsGridProps) {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {title}
        </h1>

        {events.length === 0 ? (
          <p className="mt-8 text-center text-text-muted">{emptyMessage}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
