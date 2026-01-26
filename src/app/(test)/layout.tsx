import { notFound } from 'next/navigation';

/**
 * Layout for test routes.
 * Returns 404 in production - test pages only available in development/test.
 */
export default function TestLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <>{children}</>;
}
