'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@cohostvip/cohost-react';
import { OrderDetails } from '@/components/OrderDetails';
import type { Order } from '@/lib/api';

interface OrderPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Parse the order slug to extract uid and orderId
 * Format: {uid}_{orderId}
 */
function parseOrderSlug(slug: string): { uid: string; orderId: string } | null {
  const parts = slug.split('_');
  if (parts.length !== 2) {
    return null;
  }
  return {
    uid: parts[0],
    orderId: parts[1],
  };
}

export default function ChannelOrderPage({ params }: OrderPageProps) {
  const searchParams = useSearchParams();
  const { authenticateWithToken } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  // Use ref to avoid infinite loops from unstable hook returns
  const authenticateWithTokenRef = useRef(authenticateWithToken);
  authenticateWithTokenRef.current = authenticateWithToken;

  // Resolve params promise
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  // Authenticate with token and fetch order
  useEffect(() => {
    if (!slug) return;

    const token = searchParams.get('token');
    const parsed = parseOrderSlug(slug);

    if (!parsed) {
      setError('Invalid order link');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        // Authenticate with the token if provided (for client-side auth state)
        if (token) {
          try {
            await authenticateWithTokenRef.current(token);
          } catch (authErr) {
            console.warn('Failed to authenticate with token:', authErr);
          }
        }

        // Fetch the order using Next.js API route (avoids CORS issues)
        const response = await fetch(`/api/orders/${parsed.orderId}?uid=${parsed.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        const fetchedOrder = data.order as Order;

        if (!isMounted) return;

        // Verify the uid matches for security
        if (fetchedOrder.uid !== parsed.uid) {
          setError('Order not found');
          setIsLoading(false);
          return;
        }

        setOrder(fetchedOrder);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        if (isMounted) {
          setError('Order not found');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [slug, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" data-testid="order-loading">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center" data-testid="order-error">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">Order Not Found</h1>
          <p className="mt-2 text-text-muted">{error || 'The order could not be found.'}</p>
        </div>
      </div>
    );
  }

  return <OrderDetails order={order} />;
}
