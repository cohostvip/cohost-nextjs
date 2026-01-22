'use client';

import { useCohostCheckout, formatCurrency } from '@cohostvip/cohost-react';
import { CouponForm } from './CouponForm';

interface CartSummaryProps {
  className?: string;
  compact?: boolean;
  onEditTickets?: () => void;
}

export function CartSummary({ className, compact, onEditTickets }: CartSummaryProps) {
  const { cartSession } = useCohostCheckout();

  const costs = cartSession?.costs;
  const items = cartSession?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Compact mode for mobile - hide when empty, show single line when has items
  if (compact) {
    if (itemCount === 0) {
      return null;
    }
    return (
      <div className={`space-y-2 ${className || ''}`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">
              {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
            </span>
            {onEditTickets && (
              <button
                onClick={onEditTickets}
                className="text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          <span className="font-semibold text-text">{formatCurrency(costs?.total)}</span>
        </div>
        <CouponForm />
      </div>
    );
  }

  // Full mode - show empty state when no items
  if (!costs || itemCount === 0) {
    return (
      <div className={`rounded-lg border border-border bg-surface p-4 ${className || ''}`}>
        <h3 className="mb-2 text-lg font-semibold text-text">Order Summary</h3>
        <p className="text-sm text-text-subtle">Select tickets to see your order</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${className || ''}`}>
      {/* Header with Edit link */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Order Summary</h3>
        {onEditTickets && (
          <button
            onClick={onEditTickets}
            className="text-sm text-accent hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {/* Tickets list */}
      <div className="space-y-2 border-b border-border pb-3 mb-3">
        {items
          .filter((item) => item.quantity > 0)
          .map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-text-muted">
                {item.quantity}x {item.offering?.name || 'Ticket'}
              </span>
              <span className="text-text-muted">
                {formatCurrency(item.costs?.total || item.costs?.subtotal)}
              </span>
            </div>
          ))}
      </div>

      {/* Coupon section */}
      <div className="border-b border-border pb-3 mb-3">
        <CouponForm />
      </div>

      {/* Costs breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(costs.subtotal)}</span>
        </div>

        {costs.fee && parseFloat(costs.fee.replace(/[^0-9.-]/g, '')) > 0 && (
          <div className="flex justify-between text-text-muted">
            <span>Fees</span>
            <span>{formatCurrency(costs.fee)}</span>
          </div>
        )}

        {costs.discount && parseFloat(costs.discount.replace(/[^0-9.-]/g, '')) > 0 && (
          <div className="flex justify-between text-green-500">
            <span>Discount</span>
            <span>-{formatCurrency(costs.discount)}</span>
          </div>
        )}

        {costs.tax && parseFloat(costs.tax.replace(/[^0-9.-]/g, '')) > 0 && (
          <div className="flex justify-between text-text-muted">
            <span>Tax</span>
            <span>{formatCurrency(costs.tax)}</span>
          </div>
        )}

        <div className="border-t border-border pt-2">
          <div className="flex justify-between text-lg font-semibold text-text">
            <span>Total</span>
            <span>{formatCurrency(costs.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
