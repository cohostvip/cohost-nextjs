'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCohostClient } from '@cohostvip/cohost-react';
import type { ContentBlock } from '@cohostvip/cohost-node';
import { GoogleMap, DateTimeCard, LocationCard, TicketsList, isTicketSoldOut } from '@/components/ui';
import type { TicketQuantities } from '@/components/ui';
import { CheckoutModal } from '@/components/checkout';
import { BlockRenderer } from '@/components/blocks';
import type { EventProfile, Ticket } from '@/lib/api';
import type { TicketGroup } from '@/components/ui/TicketsList/types';

// Extended event type that may include ticket groups and content blocks
interface EventWithGroups extends EventProfile {
  ticketGroups?: TicketGroup[];
  contentBlocks?: ContentBlock[];
}

interface EventDetailsProps {
  event: EventWithGroups;
  tickets: Ticket[];
}

export function EventDetails({ event, tickets }: EventDetailsProps) {
  const router = useRouter();
  const { client } = useCohostClient();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartSessionId, setCartSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pendingQuantitiesRef = useRef<TicketQuantities | null>(null);

  const handleOrderComplete = useCallback(() => {
    // Refresh server data to get updated ticket availability
    // Don't clear cartSessionId here - let the confirmation screen show first
    router.refresh();
  }, [router]);

  const handleGetTickets = useCallback(async (quantities: TicketQuantities) => {
    // Store quantities for setting in cart after creation
    pendingQuantitiesRef.current = quantities;
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
    // Clear cart session so a new one is created on next purchase
    setCartSessionId(null);
  }, []);


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
          {/* Date & Location */}
          <div className="space-y-4">
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
            <TicketsList
              tickets={tickets}
              ticketGroups={event.ticketGroups}
              onGetTickets={handleGetTickets}
              isLoading={isLoading}
            />
          )}

          {/* Content Blocks */}
          {event.contentBlocks && event.contentBlocks.length > 0 && (
            <div className="space-y-8">
              {event.contentBlocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          )}

          {/* Google Map */}
          {event.location?.geometry && (
            <GoogleMap
              lat={event.location.geometry.lat}
              lng={event.location.geometry.lng}
              venueName={event.location.name}
              address={event.location.address?.formattedAddress}
            />
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {cartSessionId && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          onOrderComplete={handleOrderComplete}
          cartSessionId={cartSessionId}
          initialQuantities={pendingQuantitiesRef.current || undefined}
        />
      )}
    </div>
  );
}
