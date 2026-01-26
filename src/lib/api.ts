import { createCohostClient, PaginatedResponse, type EventProfile, type Ticket, type Order } from '@cohostvip/cohost-node';

/**
 * Centralized Cohost API client instance.
 * Uses the NEXT_PUBLIC_COHOST_TOKEN environment variable for authentication.
 */
export const cohostClient = createCohostClient({
  token: process.env.NEXT_PUBLIC_COHOST_TOKEN!,
});

/**
 * Fetch all events from the API.
 */
export async function getEvents(): Promise<PaginatedResponse<EventProfile>> {
  return cohostClient.events.list();
}

/**
 * Fetch a single event by ID.
 */
export async function getEvent(id: string): Promise<EventProfile> {
  return cohostClient.events.fetch(id);
}

/**
 * Fetch a single event by URL slug.
 */
export async function getEventByUrl(url: string): Promise<EventProfile | null> {
  const e = await cohostClient.events.fetch(url);
  return e || null;
}

/**
 * Fetch tickets for an event.
 */
export async function getEventTickets(eventId: string): Promise<Ticket[]> {
  return cohostClient.events.tickets(eventId);
}

/**
 * Fetch events filtered by tag.
 */
export async function getEventsByTag(tag: string): Promise<EventProfile[]> {
  const response = await cohostClient.events.list();
  return response.results.filter((event) => event.tags?.includes(tag));
}

/**
 * Get all unique tags from events.
 */
export async function getAllTags(): Promise<string[]> {
  const response = await cohostClient.events.list();
  const tags = new Set<string>();
  response.results.forEach((event) => {
    event.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Fetch a single order by ID.
 */
export async function getOrder(id: string): Promise<Order> {
  return cohostClient.orders.fetch(id);
}

// Re-export types for convenience
export type { EventProfile, Ticket, Order };
