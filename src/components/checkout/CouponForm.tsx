'use client';

import { useState, useEffect } from 'react';
import { useCohostCheckout } from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';

interface CouponFormProps {
  className?: string;
}

function parseErrorMessage(err: any): string {
  // If it's a string that looks like JSON, try to parse it
  if (typeof err === 'string') {
    try {
      const parsed = JSON.parse(err);
      return parsed?.error?.message || parsed?.message || 'Invalid coupon code';
    } catch {
      return err;
    }
  }

  // If err.message is JSON string
  if (typeof err?.message === 'string') {
    try {
      const parsed = JSON.parse(err.message);
      return parsed?.error?.message || parsed?.message || 'Invalid coupon code';
    } catch {
      return err.message;
    }
  }

  return 'Invalid coupon code';
}

export function CouponForm({ className }: CouponFormProps) {
  const { cartSession, applyCoupon, removeCoupon } = useCohostCheckout();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const appliedCoupons = cartSession?.coupons || [];

  // Auto-dismiss error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await applyCoupon(code.trim());
      setCode('');
      setIsExpanded(false);
    } catch (err: any) {
      const message = parseErrorMessage(err);
      setError(message);
      setCode('');
      setIsExpanded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (couponId: string) => {
    try {
      await removeCoupon(couponId);
    } catch (err: any) {
      const message = parseErrorMessage(err);
      setError(message);
    }
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className={className}>
      {/* Error message - dismissible */}
      {error && (
        <button
          onClick={dismissError}
          className="mb-3 flex w-full items-center justify-between rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500 transition-opacity hover:bg-red-500/20"
        >
          <span>{error}</span>
          <span className="text-xs opacity-60">tap to dismiss</span>
        </button>
      )}

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
      {!isExpanded && appliedCoupons.length === 0 && !error ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-sm text-accent hover:underline"
        >
          Have a coupon code?
        </button>
      ) : isExpanded && appliedCoupons.length === 0 ? (
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
    </div>
  );
}
