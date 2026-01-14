import type { EventProfile } from './api';

export const routes = {
  home: '/',
  events: '/events',
  event: (id: string) => `/events/${id}`,
} as const;

export function resolveEventUrl(event: EventProfile): string {
  return routes.event(event.url || event.id);
}
