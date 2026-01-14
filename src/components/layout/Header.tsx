import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-text">
          Cohost
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Events
          </Link>
        </div>
      </nav>
    </header>
  );
}
