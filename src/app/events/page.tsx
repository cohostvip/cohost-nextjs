import type { Metadata } from 'next';
import { EventsGrid } from '@/components/events';
import { getEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'All Events | Cohost',
  description: 'Browse all upcoming events and get your tickets',
};

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsGrid events={events} title="All Events" />;
}
