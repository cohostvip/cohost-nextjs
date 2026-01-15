'use client';

import { useState } from 'react';
import { formatCurrency } from '@cohostvip/cohost-react';
import type { Ticket } from '@/lib/api';

interface TicketCardProps {
  ticket: Ticket;
  className?: string;
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

export function isTicketSoldOut(ticket: Ticket): boolean {
  return ticket.status === 'sold-out';
}

export function TicketCard({ ticket, className }: TicketCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isSoldOut = isTicketSoldOut(ticket);
  const { price, hasFees } = formatTicketPrice(ticket);

  return (
    <div
      className={`rounded-lg border bg-background p-4 ${
        isSoldOut ? 'border-border opacity-60' : 'border-border'
      } ${className || ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-text">{ticket.name}</h4>
            {isSoldOut && (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                Sold Out
              </span>
            )}
          </div>
          <p className={`mt-1 text-lg font-semibold ${isSoldOut ? 'text-text-muted' : 'text-accent'}`}>
            {price}
            {hasFees && price !== 'Free' && (
              <span className="ml-1 text-sm font-normal text-text-muted">(incl. fees)</span>
            )}
          </p>
        </div>

        {ticket.description && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-accent hover:underline"
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>
        )}
      </div>

      {showDetails && ticket.description && (
        <div
          className="mt-3 border-t border-border pt-3 text-sm text-text-muted prose prose-sm prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: ticket.description }}
        />
      )}
    </div>
  );
}
