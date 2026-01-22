'use client';

import { useCohostCheckout, formatCurrency } from '@cohostvip/cohost-react';

interface CartSummaryProps {
  className?: string;
  compact?: boolean;
}

export function CartSummary({ className, compact }: CartSummaryProps) {
  const { cartSession } = useCohostCheckout();

  const costs = cartSession?.costs;
  const itemCount = cartSession?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Compact mode for mobile - hide when empty, show single line when has items
  if (compact) {
    if (itemCount === 0) {
      return null;
    }
    return (
      <div className={`flex items-center justify-between text-sm ${className || ''}`}>
        <span className="text-text-muted">
          {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
        </span>
        <span className="font-semibold text-text">{formatCurrency(costs?.total)}</span>
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
      <h3 className="mb-4 text-lg font-semibold text-text">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
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
