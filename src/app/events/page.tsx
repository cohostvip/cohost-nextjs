import type { Metadata } from 'next';
import { EventsGrid } from '@/components/events';
import { getEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'All Events | Cohost',
  description: 'Browse all upcoming events and get your tickets',
};

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsGrid events={events.results} title="All Events" />;
}
