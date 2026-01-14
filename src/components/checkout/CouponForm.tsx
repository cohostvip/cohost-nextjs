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

  const appliedCoupons = cartSession?.coupons || [];

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await applyCoupon(code.trim());
      setCode('');
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

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
