'use client';

import { useState, useCallback } from 'react';
import { useCohostClient } from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';
import { CheckoutModal } from '@/components/checkout';
import type { EventProfile, Ticket } from '@/lib/api';

interface EventDetailsProps {
  event: EventProfile;
  tickets: Ticket[];
}

function formatDate(dateString: string, timezone?: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });
}

function formatTime(dateString: string, timezone?: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  });
}

export function EventDetails({ event, tickets }: EventDetailsProps) {
  const { client } = useCohostClient();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartSessionId, setCartSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      // Create a new cart session with the event as context
      const cart = await client.cart.start({
        contextId: `evt_${event.id}`,
        sessionContext: {
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        },
      });

      if (cart?.id) {
        setCartSessionId(cart.id);
        setIsCheckoutOpen(true);
      }
    } catch (error) {
      console.error('Failed to start checkout:', error);
    } finally {
      setIsLoading(false);
    }
  }, [client, event.id]);

  const handleCloseCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    setCartSessionId(null);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Event Image */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            {event.flyer?.url ? (
              <img
                src={event.flyer.url}
                alt={event.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface">
                <span className="text-text-subtle">No image available</span>
              </div>
            )}
          </div>

          {/* Event Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-text">About this event</h2>
            {event.description?.html ? (
              <div
                className="prose prose-invert mt-4 max-w-none text-text-muted"
                dangerouslySetInnerHTML={{ __html: event.description.html }}
              />
            ) : event.summary ? (
              <p className="mt-4 text-text-muted">{event.summary}</p>
            ) : (
              <p className="mt-4 text-text-subtle">No description available</p>
            )}
          </div>
        </div>

        {/* Event Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 rounded-lg border border-border bg-surface p-6">
            <div>
              <h1 className="text-2xl font-bold text-text">{event.name}</h1>
              {event.organizer?.name && (
                <p className="mt-2 text-sm text-text-muted">
                  by {event.organizer.name}
                </p>
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text">Date and Time</h3>
              <p className="text-text-muted">
                {formatDate(event.start, event.tz)}
              </p>
              <p className="text-text-muted">
                {formatTime(event.start, event.tz)} - {formatTime(event.end, event.tz)}
              </p>
            </div>

            {/* Location */}
            {event.location && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text">Location</h3>
                <p className="text-text-muted">{event.location.name}</p>
                {event.location.address && (
                  <p className="text-sm text-text-subtle">
                    {event.location.address.formattedAddress}
                  </p>
                )}
              </div>
            )}

            {/* Tickets */}
            {tickets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-text">Tickets</h3>
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-md border border-border bg-background p-3"
                  >
                    <div>
                      <p className="font-medium text-text">{ticket.name}</p>
                      {ticket.description && (
                        <p className="text-sm text-text-muted">{ticket.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleGetTickets}
              disabled={isLoading || tickets.length === 0}
            >
              {isLoading ? 'Loading...' : 'Get Tickets'}
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {cartSessionId && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          cartSessionId={cartSessionId}
        />
      )}
    </div>
  );
}
