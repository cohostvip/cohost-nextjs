import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EventsGrid } from '@/components/events';
import { getEventsByTag } from '@/lib/api';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag} Events | Cohost`,
    description: `Discover events tagged with "${decodedTag}"`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  try {
    const events = await getEventsByTag(decodedTag);

    return (
      <EventsGrid
        events={events}
        title={`Events tagged "${decodedTag}"`}
        emptyMessage={`No events found with tag "${decodedTag}"`}
      />
    );
  } catch {
    notFound();
  }
}
