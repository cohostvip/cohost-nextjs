'use client';

import { useState } from 'react';
import { useCohostCheckout, formatCurrency } from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';

interface TicketSelectorProps {
  className?: string;
}

function formatTicketPrice(costs?: any): { price: string; hasFees: boolean } {
  if (!costs) return { price: 'Free', hasFees: false };

  const total = costs.total;
  const cost = costs.cost;
  const fee = costs.fee;

  if (!total && !cost) return { price: 'Free', hasFees: false };

  // Use total (includes fees) as the displayed price
  const priceValue = total || cost;

  // Parse currency amount (format: "USD,0" or "USD,5000")
  const parts = priceValue?.split(',');
  if (parts && parts.length === 2) {
    const value = parseInt(parts[1], 10);
    if (value === 0) return { price: 'Free', hasFees: false };
  }

  // Check if there are fees included
  const hasFees = fee ? parseInt(fee.split(',')[1] || '0', 10) > 0 : false;

  return {
    price: formatCurrency(priceValue) || 'Free',
    hasFees
  };
}

interface TicketItemProps {
  item: any;
  onIncrement: () => void;
  onDecrement: () => void;
}

function TicketItem({ item, onIncrement, onDecrement }: TicketItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const offering = item.offering;
  const { price, hasFees } = formatTicketPrice(offering?.costs);
  const isSoldOut = offering?.status === 'sold-out';

  return (
    <div
      className={`rounded-lg border border-border bg-background p-4 ${
        isSoldOut ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-text">{offering?.name || 'Ticket'}</h4>
            {isSoldOut && (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                Sold Out
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm font-semibold ${isSoldOut ? 'text-text-muted' : 'text-accent'}`}>
            {price}
            {hasFees && price !== 'Free' && (
              <span className="ml-1 text-xs font-normal text-text-muted">(incl. fees)</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={onDecrement}
            disabled={item.quantity === 0 || isSoldOut}
            className="h-8 w-8 p-0"
          >
            -
          </Button>
          <span className="w-8 text-center font-medium text-text">
            {item.quantity}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={onIncrement}
            disabled={
              isSoldOut ||
              (offering?.maximumQuantity !== undefined &&
                item.quantity >= offering.maximumQuantity)
            }
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>
      </div>

      {offering?.description && (
        <div className="mt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-accent hover:underline"
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>

          {showDetails && (
            <div
              className="mt-2 text-sm text-text-muted prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: offering.description }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function TicketSelector({ className }: TicketSelectorProps) {
  const { cartSession, incrementItem, decrementItem } = useCohostCheckout();

  if (!cartSession?.items?.length) {
    return (
      <div className={className}>
        <p className="text-text-subtle">No tickets available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {cartSession.items.map((item) => (
        <TicketItem
          key={item.id}
          item={item}
          onIncrement={() => incrementItem(item.id)}
          onDecrement={() => decrementItem(item.id)}
        />
      ))}
    </div>
  );
}
