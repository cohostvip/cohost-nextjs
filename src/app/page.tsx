import { Hero, FeaturedEvents } from '@/components/home';
import { getEvents } from '@/lib/api';

export default async function HomePage() {
  const events = await getEvents();

  return (
    <>
      <Hero />
      <FeaturedEvents events={events} />
    </>
  );
}
