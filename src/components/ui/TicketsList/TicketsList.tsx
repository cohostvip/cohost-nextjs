'use client';

import { useState, useCallback } from 'react';

import { Button } from '@/components/ui/Button';
import type { Ticket } from '@/lib/api';
import { TicketGroup, TicketQuantities, TicketsListProps, TicketWithGroup } from './types';
import { isTicketSoldOut, getTicketSalesStatus, formatSalesStartDate } from './utils';
import { TicketListItem } from './TicketListItem';



function TicketGroupSection({
  group,
  tickets,
  quantities,
  onQuantityChange,
  showSalesStatus,
  eventStart,
}: {
  group?: TicketGroup;
  tickets: Ticket[];
  quantities: TicketQuantities;
  onQuantityChange: (ticketId: string, quantity: number) => void;
  showSalesStatus?: boolean;
  eventStart?: Date;
}) {
  if (tickets.length === 0) return null;

  return (
    <div>
      {group && (
        <div className="border-b border-border pb-2 mb-2">
          <h3 className="font-semibold text-text">{group.name}</h3>
          {group.description && (
            <p className="text-sm text-text-muted">{group.description}</p>
          )}
        </div>
      )}
      <div className="divide-y divide-border">
        {tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onQuantityChange={(qty) => onQuantityChange(ticket.id, qty)}
            showSalesStatus={showSalesStatus}
            eventStart={eventStart}
          />
        ))}
      </div>
    </div>
  );
}

export function TicketsList({
  tickets,
  ticketGroups,
  onGetTickets,
  isLoading,
  className,
  showSalesStatus,
  eventStart: eventStartProp,
}: TicketsListProps) {
  // Convert eventStart to Date if it's a string
  const eventStart = eventStartProp ? (typeof eventStartProp === 'string' ? new Date(eventStartProp) : eventStartProp) : undefined;
  const [quantities, setQuantities] = useState<TicketQuantities>({});

  const handleQuantityChange = useCallback((ticketId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  }, []);

  const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const hasAvailableTickets = tickets.some((t) => !isTicketSoldOut(t));

  // Check if ALL tickets have sales starting in the future
  const allTicketsNotStarted = showSalesStatus && tickets.length > 0 && tickets.every((t) => {
    const status = getTicketSalesStatus(t);
    return status.status === 'not-started';
  });

  // Find the earliest salesStart date if all tickets are not started
  const earliestSalesStart = allTicketsNotStarted
    ? tickets.reduce((earliest, t) => {
        const status = getTicketSalesStatus(t);
        if (status.status === 'not-started') {
          return !earliest || status.startsAt < earliest ? status.startsAt : earliest;
        }
        return earliest;
      }, null as Date | null)
    : null;

  const handleGetTickets = () => {
    onGetTickets(quantities);
  };

  // Group tickets if ticketGroups are provided
  const renderTickets = () => {
    if (ticketGroups && ticketGroups.length > 0) {
      const sortedGroups = [...ticketGroups]
        .filter((g) => g.status !== 'hidden')
        .sort((a, b) => a.sorting - b.sorting);

      const groupedTickets = sortedGroups.map((group) => ({
        group,
        tickets: tickets.filter((t) => (t as TicketWithGroup).offeringGroupId === group.id),
      }));

      // Ungrouped tickets
      const ungroupedTickets = tickets.filter(
        (t) => !ticketGroups.some((g) => g.id === (t as TicketWithGroup).offeringGroupId)
      );

      return (
        <div className="space-y-6">
          {groupedTickets.map(({ group, tickets: groupTickets }) => (
            <TicketGroupSection
              key={group.id}
              group={group}
              tickets={groupTickets}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              showSalesStatus={effectiveShowSalesStatus}
              eventStart={eventStart}
            />
          ))}
          {ungroupedTickets.length > 0 && (
            <TicketGroupSection
              tickets={ungroupedTickets}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              showSalesStatus={effectiveShowSalesStatus}
              eventStart={eventStart}
            />
          )}
        </div>
      );
    }

    // No groups - render flat list
    return (
      <div className="divide-y divide-border">
        {tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onQuantityChange={(qty) => handleQuantityChange(ticket.id, qty)}
            showSalesStatus={effectiveShowSalesStatus}
            eventStart={eventStart}
          />
        ))}
      </div>
    );
  };

  if (tickets.length === 0) {
    return null;
  }

  // Don't show individual sales status badges when showing the global banner
  const effectiveShowSalesStatus = showSalesStatus && !allTicketsNotStarted;

  return (
    <div className={`rounded-lg border border-border bg-surface overflow-hidden ${className || ''}`}>
      {/* Card header */}
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold text-text">Tickets</h2>
      </div>

      {/* Sales not started banner */}
      {allTicketsNotStarted && earliestSalesStart && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-center">
          <p className="text-sm font-medium text-amber-400">
            Tickets on sale {formatSalesStartDate(earliestSalesStart)}
          </p>
        </div>
      )}

      {/* Tickets list */}
      <div className="px-4">
        {renderTickets()}
      </div>

      {/* Get Tickets button */}
      <div className="p-4 pt-2">
        <Button
          size="lg"
          fullWidth
          onClick={handleGetTickets}
          disabled={!hasAvailableTickets || totalQuantity === 0}
          loading={isLoading}
          data-testid="get-tickets-button"
        >
          {!hasAvailableTickets
            ? 'Sold Out'
            : totalQuantity === 0
              ? 'Select Tickets'
              : `Get ${totalQuantity} Ticket${totalQuantity !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}

export type { TicketQuantities };
