'use client';

import type { Order } from '@/lib/api';
import { formatCurrency, isZeroAmount } from '@/lib/formatCurrency';

type OrderCosts = Order['costs'];

interface OrderSummaryProps {
  costs: OrderCosts;
}

export function OrderSummary({ costs }: OrderSummaryProps) {
  const showFees = !isZeroAmount(costs.fee);
  const showDelivery = !isZeroAmount(costs.delivery);
  const showDiscount = !isZeroAmount(costs.discount);
  const showTax = !isZeroAmount(costs.tax);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-text mb-3">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(costs.subtotal)}</span>
        </div>

        {showFees && (
          <div className="flex justify-between text-text-muted">
            <span>Fees</span>
            <span>{formatCurrency(costs.fee)}</span>
          </div>
        )}

        {showDelivery && (
          <div className="flex justify-between text-text-muted">
            <span>Delivery</span>
            <span>{formatCurrency(costs.delivery)}</span>
          </div>
        )}

        {showTax && (
          <div className="flex justify-between text-text-muted">
            <span>Tax</span>
            <span>{formatCurrency(costs.tax)}</span>
          </div>
        )}

        {showDiscount && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-{formatCurrency(costs.discount)}</span>
          </div>
        )}

        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between font-semibold text-text">
            <span>Total</span>
            <span>{formatCurrency(costs.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
