import type { EventProfile } from './api';

export const routes = {
  home: '/',
  events: '/events',
  event: (id: string) => `/events/${id}`,
  order: (id: string) => `/orders/${id}`,
  tag: (tag: string) => `/tags/${encodeURIComponent(tag)}`,
} as const;

export function resolveEventUrl(event: EventProfile): string {
  return routes.event(event.url || event.id);
}
