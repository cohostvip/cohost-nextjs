import { EventCard } from '@/components/ui';
import type { EventProfile } from '@/lib/api';

interface FeaturedEventsProps {
  events: EventProfile[];
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Featured Events
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Check out these upcoming events
          </p>
        </div>

        

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
