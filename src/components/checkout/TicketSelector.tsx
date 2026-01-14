'use client';

import { useCohostCheckout, formatCurrency } from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';

interface TicketSelectorProps {
  className?: string;
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
      {cartSession.items.map((item) => {
        const offering = item.offering;
        const price = formatCurrency(offering?.costs?.cost);

        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
          >
            <div className="flex-1">
              <h4 className="font-medium text-text">{offering?.name || 'Ticket'}</h4>
              {offering?.description && (
                <p className="mt-1 text-sm text-text-muted">{offering.description}</p>
              )}
              <p className="mt-1 text-sm font-semibold text-accent">{price}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => decrementItem(item.id)}
                disabled={item.quantity === 0}
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
                onClick={() => incrementItem(item.id)}
                disabled={
                  offering?.maximumQuantity !== undefined &&
                  item.quantity >= offering.maximumQuantity
                }
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
