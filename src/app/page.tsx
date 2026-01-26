import { Hero, FeaturedEvents } from '@/components/home';
import { getEvents } from '@/lib/api';

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let events: Awaited<ReturnType<typeof getEvents>> | null = null;

  try {
    events = await getEvents();
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return (
    <>
      <Hero />
      {events ? (
        <FeaturedEvents events={events.results} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-600">Unable to load events. Please try again later.</p>
        </div>
      )}
    </>
  );
}
