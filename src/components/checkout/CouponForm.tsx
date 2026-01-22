'use client';

import { useState } from 'react';
import { useCohostCheckout } from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';

interface CouponFormProps {
  className?: string;
}

export function CouponForm({ className }: CouponFormProps) {
  const { cartSession, applyCoupon, removeCoupon } = useCohostCheckout();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const appliedCoupons = cartSession?.coupons || [];

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await applyCoupon(code.trim());
      setCode('');
      setIsExpanded(false);
    } catch (err: any) {
      setError(err?.message || 'Invalid coupon code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (couponId: string) => {
    try {
      await removeCoupon(couponId);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove coupon');
    }
  };

  return (
    <div className={className}>
      {/* Applied coupons */}
      {appliedCoupons.length > 0 && (
        <div className="mb-3 space-y-2">
          {appliedCoupons.map((coupon: any) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between rounded-md bg-green-500/10 px-3 py-2 text-sm"
            >
              <span className="font-medium text-green-500">
                {coupon.code} applied
              </span>
              <button
                onClick={() => handleRemove(coupon.id)}
                className="text-text-muted hover:text-text"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coupon input - toggle visibility */}
      {!isExpanded && appliedCoupons.length === 0 ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-sm text-accent hover:underline"
        >
          Have a coupon code?
        </button>
      ) : appliedCoupons.length === 0 ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 rounded-md border border-text-subtle bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              autoFocus
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleApply}
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? '...' : 'Apply'}
            </Button>
          </div>
          <button
            onClick={() => {
              setIsExpanded(false);
              setCode('');
              setError(null);
            }}
            className="text-xs text-text-subtle hover:text-text-muted"
          >
            Cancel
          </button>
        </div>
      ) : null}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
