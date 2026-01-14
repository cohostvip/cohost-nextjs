import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Cohost. All rights reserved.
          </p>

          <nav className="flex gap-6">
            <Link
              href="/events"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Events
            </Link>
            <Link
              href="/"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
