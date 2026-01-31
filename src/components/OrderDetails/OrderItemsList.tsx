'use client';

import type { Order } from '@/lib/api';
import { formatCurrency, isZeroAmount } from '@/lib/formatCurrency';

type OrderItem = Order['items'][number];

// The API returns category but the type doesn't include it
type OfferingWithCategory = OrderItem['offering'] & { category?: string };

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-text mb-3">Tickets</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text">{item.offering.name}</span>
                {item.quantity > 1 && (
                  <span className="text-text-muted">x{item.quantity}</span>
                )}
              </div>

              {(item.offering as OfferingWithCategory).category && (
                <p className="text-sm text-text-subtle">{(item.offering as OfferingWithCategory).category}</p>
              )}

              {item.purchaseGroupId && (
                <p className="text-sm text-text-muted mt-1">
                  Group ID: <span className="font-mono">{item.purchaseGroupId}</span>
                </p>
              )}
            </div>
            {isZeroAmount(item.costs.subtotal) && isZeroAmount(item.costs.total) ? (

              <div className="text-right flex-shrink-0">

                <p className="font-medium text-text">
                  -- 
                </p>
              </div>
            ) : (

              <div className="text-right flex-shrink-0">

                <p className="font-medium text-text">
                  {formatCurrency(item.costs.subtotal)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-text-subtle">
                    {formatCurrency(item.costs.cost)} each
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
