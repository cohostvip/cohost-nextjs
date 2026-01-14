'use client';

import { useCohostCheckout, formatCurrency } from '@cohostvip/cohost-react';

interface CartSummaryProps {
  className?: string;
}

export function CartSummary({ className }: CartSummaryProps) {
  const { cartSession } = useCohostCheckout();

  const costs = cartSession?.costs;
  const itemCount = cartSession?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!costs || itemCount === 0) {
    return null;
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
