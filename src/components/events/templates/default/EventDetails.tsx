'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useCohostClient } from '@cohostvip/cohost-react';
import { Button, GoogleMap, DateTimeCard, LocationCard, TicketCard, isTicketSoldOut } from '@/components/ui';
import { CheckoutModal } from '@/components/checkout';
import type { EventProfile, Ticket } from '@/lib/api';

interface EventDetailsProps {
  event: EventProfile;
  tickets: Ticket[];
}

export function EventDetails({ event, tickets }: EventDetailsProps) {
  const { client } = useCohostClient();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartSessionId, setCartSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetTickets = useCallback(async () => {
    setIsLoading(true);
    try {
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

  const hasAvailableTickets = tickets.some((t) => !isTicketSoldOut(t));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Event Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text md:text-4xl">{event.name}</h1>
        {event.organizer?.name && (
          <p className="mt-2 text-lg text-text-muted">by {event.organizer.name}</p>
        )}


      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Event Flyer */}
        <div className="lg:col-span-1">
          <div className="aspect-square overflow-hidden rounded-lg sticky top-24">
            {event.flyer?.url ? (
              <img
                src={event.flyer.url}
                alt={event.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface">
                <span className="text-text-subtle">No image available</span>
              </div>
            )}
          </div>
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-surface px-3 py-1 text-sm text-text-muted hover:bg-surface-elevated hover:text-text transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Event Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Date, Time & Location */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DateTimeCard
              start={event.start}
              end={event.end}
              timezone={event.tz}
            />

            {event.location && (
              <LocationCard
                name={event.location.name}
                address={event.location.address?.formattedAddress}
              />
            )}
          </div>

          {/* Tickets Section */}
          {tickets.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-text mb-4">Tickets</h2>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                onClick={handleGetTickets}
                disabled={isLoading || !hasAvailableTickets}
              >
                {isLoading ? 'Loading...' : hasAvailableTickets ? 'Get Tickets' : 'Sold Out'}
              </Button>
            </div>
          )}

          {/* Event Description */}
          <div>
            <h2 className="text-xl font-bold text-text mb-4">About this event</h2>
            {event.description?.html ? (
              <div
                className="prose prose-invert max-w-none text-text-muted"
                dangerouslySetInnerHTML={{ __html: event.description.html }}
              />
            ) : event.summary ? (
              <p className="text-text-muted">{event.summary}</p>
            ) : (
              <p className="text-text-subtle">No description available</p>
            )}
          </div>

          {/* Google Map */}
          {event.location?.geometry && (
            <div>
              <h2 className="text-xl font-bold text-text mb-4">Venue Location</h2>
              <GoogleMap
                lat={event.location.geometry.lat}
                lng={event.location.geometry.lng}
                venueName={event.location.name}
                address={event.location.address?.formattedAddress}
              />
            </div>
          )}
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
