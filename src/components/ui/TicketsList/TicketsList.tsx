'use client';

import { useState, useCallback } from 'react';

import { Button } from '@/components/ui/Button';
import type { Ticket } from '@/lib/api';
import { TicketGroup, TicketQuantities, TicketsListProps, TicketWithGroup } from './types';
import { isTicketSoldOut } from './utils';
import { TicketListItem } from './TicketListItem';



function TicketGroupSection({
  group,
  tickets,
  quantities,
  onQuantityChange,
}: {
  group?: TicketGroup;
  tickets: Ticket[];
  quantities: TicketQuantities;
  onQuantityChange: (ticketId: string, quantity: number) => void;
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
}: TicketsListProps) {
  const [quantities, setQuantities] = useState<TicketQuantities>({});

  const handleQuantityChange = useCallback((ticketId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  }, []);

  const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const hasAvailableTickets = tickets.some((t) => !isTicketSoldOut(t));

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
            />
          ))}
          {ungroupedTickets.length > 0 && (
            <TicketGroupSection
              tickets={ungroupedTickets}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
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
          />
        ))}
      </div>
    );
  };

  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg border border-border bg-surface overflow-hidden ${className || ''}`}>
      {/* Card header */}
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold text-text">Tickets</h2>
      </div>

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
