import { createCohostClient, type EventProfile, type Ticket } from '@cohostvip/cohost-node';

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
export async function getEvents(): Promise<EventProfile[]> {
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
  const events = await cohostClient.events.list();
  return events.find((event) => event.url === url) ?? null;
}

/**
 * Fetch tickets for an event.
 */
export async function getEventTickets(eventId: string): Promise<Ticket[]> {
  return cohostClient.events.tickets(eventId);
}

// Re-export types for convenience
export type { EventProfile, Ticket };
