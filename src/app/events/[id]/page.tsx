import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EventDetails } from '@/components/events';
import { getEvent, getEventContentBlocks, getEventTickets } from '@/lib/api';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

async function fetchEvent(idOrSlug: string) {
  const event = await getEvent(idOrSlug);

  if (!event) return null;

  const contentBlocks = await getEventContentBlocks(event.id);

  return {
    ...event,
    contentBlocks,
  };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;

  const event = await fetchEvent(id);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.name} | Cohost`,
    description: event.summary || `Get tickets for ${event.name}`,
    openGraph: {
      title: event.name,
      description: event.summary || undefined,
      images: event.flyer?.url ? [event.flyer.url] : undefined,
    },
  };
}

export default async function EventByIdPage({ params }: EventPageProps) {
  const { id } = await params;

  const event = await fetchEvent(id);
  if (!event) {
    notFound();
  }

  const tickets = await getEventTickets(event.id);

  return <EventDetails event={event} tickets={tickets} />;
}
