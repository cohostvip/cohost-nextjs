import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EventDetails } from '@/components/events';
import { getEvent, getEventByUrl, getEventTickets } from '@/lib/api';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

async function fetchEvent(idOrUrl: string) {
  // Try by URL slug first, then by ID
  const eventByUrl = await getEventByUrl(idOrUrl);
  if (eventByUrl) return eventByUrl;
  return getEvent(idOrUrl);
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await fetchEvent(id);

    return {
      title: `${event.name} | Cohost`,
      description: event.summary || `Get tickets for ${event.name}`,
      openGraph: {
        title: event.name,
        description: event.summary || undefined,
        images: event.flyer?.url ? [event.flyer.url] : undefined,
      },
    };
  } catch {
    return {
      title: 'Event Not Found',
    };
  }
}

export default async function EventByIdPage({ params }: EventPageProps) {
  const { id } = await params;

  const event = await fetchEvent(id).catch(() => null);
  if (!event) {
    notFound();
  }

  const tickets = await getEventTickets(event.id);

  return <EventDetails event={event} tickets={tickets} />;
}
