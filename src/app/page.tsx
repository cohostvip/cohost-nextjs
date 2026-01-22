import { Hero, FeaturedEvents } from '@/components/home';
import { getEvents } from '@/lib/api';

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await getEvents();

  return (
    <>
      <Hero />
      <FeaturedEvents events={events.results} />
    </>
  );
}
