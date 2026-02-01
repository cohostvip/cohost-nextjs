'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, useCohostClient, formatCurrency } from '@cohostvip/cohost-react';
import type { OrderListItem, OrdersListResponse } from '@/lib/api';

function OrderCard({ order, uid }: { order: OrderListItem; uid: string }) {
  const { id, orderNumber, status, created, costs, meta } = order;
  const resolvedContext = meta?.resolvedContext;

  const formattedDate = new Date(created).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const statusColors: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
    pending: 'bg-yellow-100 text-yellow-800',
    voided: 'bg-gray-100 text-gray-800',
  };

  const statusColor = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <Link
      href={`/account/orders/${uid}_${id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/50 hover:bg-surface-hover"
    >
      <div className="flex gap-4">
        {resolvedContext?.logo?.url && (
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={resolvedContext.logo.url}
              alt={resolvedContext.title || 'Event'}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-text truncate">
                {resolvedContext?.title || `Order #${orderNumber}`}
              </h3>
              <p className="text-sm text-text-muted">Order #{orderNumber}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
              {status}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">{formattedDate}</span>
            <span className="font-medium text-text">
              {costs?.total ? formatCurrency(costs.total) : '$0.00'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <div className="mx-auto mb-4 h-12 w-12 text-text-muted">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-text">No orders yet</h3>
      <p className="mt-1 text-text-muted">
        When you purchase tickets, your orders will appear here.
      </p>
      <Link
        href="/events"
        className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Browse Events
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="h-16 w-16 rounded-lg bg-surface-hover" />
            <div className="flex-1">
              <div className="h-5 w-48 rounded bg-surface-hover" />
              <div className="mt-2 h-4 w-32 rounded bg-surface-hover" />
              <div className="mt-3 flex justify-between">
                <div className="h-4 w-24 rounded bg-surface-hover" />
                <div className="h-4 w-16 rounded bg-surface-hover" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerifyEmailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { requestOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await requestOTP(email.trim());
      if (success) {
        setStep('code');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await verifyOTP(email.trim(), code.trim());
      onClose();
    } catch {
      setError('Invalid verification code. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCode('');
    setStep('email');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-xl border border-border bg-surface p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-text text-center">Verify your email</h2>
        <p className="mt-2 text-text-muted text-center text-sm">
          {step === 'email'
            ? 'Enter the email you used when purchasing tickets.'
            : `We sent a verification code to ${email}`}
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="mt-6 space-y-4">
            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-text">
                Email address
              </label>
              <input
                type="email"
                id="modal-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send verification code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
            <div>
              <label htmlFor="modal-code" className="block text-sm font-medium text-text">
                Verification code
              </label>
              <input
                type="text"
                id="modal-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                autoFocus
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-center text-lg tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError(null);
              }}
              className="w-full text-sm text-text-muted hover:text-text"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function VerifyPrompt({ onVerifyClick }: { onVerifyClick: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <h3 className="text-lg font-medium text-text">Verify your email to view orders</h3>
      <p className="mt-1 text-text-muted">
        Enter the email you used when purchasing tickets.
      </p>
      <button
        onClick={onVerifyClick}
        className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Get verification code
      </button>
    </div>
  );
}

export default function OrdersListPage() {
  const { state, getToken } = useAuth();
  const { apiUrl } = useCohostClient();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const { user, isLoading: authLoading } = state;

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch(`${apiUrl}/orders/v1/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = (await response.json()) as { ok: boolean; data: OrdersListResponse };
        if (data.ok && data.data) {
          setOrders(data.data.orders);
          setHasMore(data.data.hasMore);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading, apiUrl, getToken]);

  return (
    <>
      <VerifyEmailModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-text">My Orders</h1>

      {authLoading || isLoading ? (
        <LoadingState />
      ) : !user ? (
        <VerifyPrompt onVerifyClick={() => setShowVerifyModal(true)} />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} uid={user.uid} />
          ))}
          {hasMore && (
            <p className="text-center text-sm text-text-muted">
              Showing recent orders. Scroll to load more.
            </p>
          )}
        </div>
      )}
      </div>
    </>
  );
}
