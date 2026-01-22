'use client';

import { useState, useCallback } from 'react';
import { formatCurrency } from '@cohostvip/cohost-react';
import { Button } from '@/components/ui/Button';
import type { Ticket } from '@/lib/api';

interface TicketGroup {
  id: string;
  name: string;
  description?: string;
  sorting: number;
  status: 'live' | 'sold-out' | 'hidden';
}

interface TicketQuantities {
  [ticketId: string]: number;
}

interface TicketsListProps {
  tickets: Ticket[];
  ticketGroups?: TicketGroup[];
  onGetTickets: (quantities: TicketQuantities) => void;
  isLoading?: boolean;
  className?: string;
}

interface TicketItemProps {
  ticket: Ticket;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function formatTicketPrice(ticket: Ticket): { price: string; hasFees: boolean } {
  if (ticket.priceCategory === 'free') {
    return { price: 'Free', hasFees: false };
  }

  const total = ticket.costs?.total;
  const cost = ticket.costs?.cost;
  const fee = ticket.costs?.fee;

  if (!total && !cost) return { price: 'Free', hasFees: false };

  const priceValue = total || cost;

  const parts = priceValue?.split(',');
  if (parts && parts.length === 2) {
    const value = parseInt(parts[1], 10);
    if (value === 0) return { price: 'Free', hasFees: false };
  }

  const hasFees = fee ? parseInt(fee.split(',')[1] || '0', 10) > 0 : false;

  return {
    price: formatCurrency(priceValue) || 'Free',
    hasFees
  };
}

function isTicketSoldOut(ticket: Ticket): boolean {
  return ticket.status === 'sold-out';
}

function TicketDetailsModal({
  ticket,
  isOpen,
  onClose
}: {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="mb-4 text-xl font-bold text-text">{ticket.name}</h3>
        {ticket.description && (
          <div
            className="prose prose-invert max-w-none text-text-muted"
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          />
        )}
      </div>
    </div>
  );
}

function TicketItem({ ticket, quantity, onIncrement, onDecrement }: TicketItemProps) {
  const [showModal, setShowModal] = useState(false);
  const isSoldOut = isTicketSoldOut(ticket);
  const { price, hasFees } = formatTicketPrice(ticket);

  // Strip HTML tags for preview and check if content is long
  const stripHtml = (html: string) => {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
    return html.replace(/<[^>]*>/g, '');
  };

  const plainDescription = ticket.description ? stripHtml(ticket.description) : '';
  const hasLongDescription = plainDescription.length > 150;

  return (
    <>
      <div className={`py-4 ${isSoldOut ? 'opacity-60' : ''}`}>
        {/* First row: name+price left, qty right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-text">{ticket.name}</h4>
              {isSoldOut && (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                  Sold Out
                </span>
              )}
            </div>
            <p className={`mt-1 text-sm ${isSoldOut ? 'text-text-muted' : 'text-accent'}`}>
              {price}
              {hasFees && price !== 'Free' && (
                <span className="ml-1 text-xs text-text-muted">(incl. fees)</span>
              )}
            </p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={onDecrement}
              disabled={quantity === 0 || isSoldOut}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <span className="w-8 text-center font-medium text-text">
              {quantity}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={onIncrement}
              disabled={isSoldOut}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>

        {/* Second row: description snippet */}
        {ticket.description && (
          <div className="mt-1">
            <p className="text-xs text-text-subtle line-clamp-2">
              {plainDescription}
            </p>
            {hasLongDescription && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-0.5 text-xs text-accent hover:underline"
              >
                View more
              </button>
            )}
          </div>
        )}
      </div>

      <TicketDetailsModal
        ticket={ticket}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

function TicketGroupSection({
  group,
  tickets,
  quantities,
  onIncrement,
  onDecrement,
}: {
  group?: TicketGroup;
  tickets: Ticket[];
  quantities: TicketQuantities;
  onIncrement: (ticketId: string) => void;
  onDecrement: (ticketId: string) => void;
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
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onIncrement={() => onIncrement(ticket.id)}
            onDecrement={() => onDecrement(ticket.id)}
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

  const handleIncrement = useCallback((ticketId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || 0) + 1,
    }));
  }, []);

  const handleDecrement = useCallback((ticketId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max((prev[ticketId] || 0) - 1, 0),
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
        tickets: tickets.filter((t) => (t as any).offeringGroupId === group.id),
      }));

      // Ungrouped tickets
      const ungroupedTickets = tickets.filter(
        (t) => !ticketGroups.some((g) => g.id === (t as any).offeringGroupId)
      );

      return (
        <div className="space-y-6">
          {groupedTickets.map(({ group, tickets: groupTickets }) => (
            <TicketGroupSection
              key={group.id}
              group={group}
              tickets={groupTickets}
              quantities={quantities}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          ))}
          {ungroupedTickets.length > 0 && (
            <TicketGroupSection
              tickets={ungroupedTickets}
              quantities={quantities}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          )}
        </div>
      );
    }

    // No groups - render flat list
    return (
      <div className="divide-y divide-border">
        {tickets.map((ticket) => (
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onIncrement={() => handleIncrement(ticket.id)}
            onDecrement={() => handleDecrement(ticket.id)}
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
          className="w-full"
          onClick={handleGetTickets}
          disabled={isLoading || !hasAvailableTickets || totalQuantity === 0}
        >
          {isLoading
            ? 'Loading...'
            : !hasAvailableTickets
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
