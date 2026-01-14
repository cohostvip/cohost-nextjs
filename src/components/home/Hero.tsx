import { Button } from '@/components/ui';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Discover Amazing
            <span className="block text-primary">Events Near You</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted sm:text-xl">
            Find and attend the best concerts, festivals, and experiences.
            Get your tickets instantly and never miss out on the events you love.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/events" size="lg">
              Browse Events
            </Button>
            <Button href="/" variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
