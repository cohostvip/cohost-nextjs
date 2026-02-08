import { createCohostClient, PaginatedResponse, type EventProfile, type Ticket, type Order, ContentBlock } from '@cohostvip/cohost-node';

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
 * Fetch a single event by ID or URL slug.
 */
export async function getEvent(idOrSlug: string): Promise<EventProfile | null> {
  try {
    return await cohostClient.events.fetch(idOrSlug);
  } catch {
    return null;
  }
}

/**
 * Fetch content blocks for an event.
 */
export async function getEventContentBlocks(eventId: string): Promise<ContentBlock[]> {
  return cohostClient.events.blocks(eventId);
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
 * @param id - The order ID
 * @param token - Optional access token for user-authenticated requests
 */
export async function getOrder(id: string, token?: string): Promise<Order> {
  // Use a token-specific client if provided, otherwise use the site client
  const client = token
    ? createCohostClient({ token })
    : cohostClient;

  // The API returns { order, organizer, transaction, transactions }
  // We need to extract just the order
  const response = await client.orders.fetch(id) as unknown as { order: Order };
  return response.order;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  created: string;
  costs: Order['costs'];
  customer: Order['customer'];
  meta?: {
    resolvedContext?: {
      title?: string;
      start?: string;
      logo?: { url?: string };
    };
  };
}

export interface OrdersListResponse {
  orders: OrderListItem[];
  hasMore: boolean;
}

// Re-export types for convenience
export type { EventProfile, Ticket, Order };
