'use client';

import { useState, useMemo } from 'react';
import { loadStripe, Stripe, PaymentIntent } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePaymentElement } from '@cohostvip/cohost-react';

interface PaymentFormProps {
  className?: string;
  onSuccess?: (result: PaymentIntent) => void;
  onError?: (error: string) => void;
}

// Cache stripe instances by publishable key
const stripeCache = new Map<string, Promise<Stripe | null>>();

const getStripe = (publishableKey: string) => {
  if (!stripeCache.has(publishableKey)) {
    stripeCache.set(publishableKey, loadStripe(publishableKey));
  }
  return stripeCache.get(publishableKey)!;
};

// Inner form component that uses Stripe hooks
function CheckoutForm({ onSuccess, onError }: { onSuccess?: (result: PaymentIntent) => void; onError?: (error: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/complete`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      onError?.(error.message || 'An error occurred');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess?.(paymentIntent);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full rounded-md bg-accent px-4 py-3 font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export function PaymentForm({ className, onSuccess, onError }: PaymentFormProps) {
  const { paymentIntent, isLoading } = usePaymentElement();

  // Debug: log payment intent data
  if (paymentIntent) {
    console.log('[PaymentForm] paymentIntent:', paymentIntent);
  }

  // Memoize stripe instance based on publishable key
  const pk = paymentIntent?.pk;
  const stripeInstance = useMemo(() => {
    if (pk) {
      return getStripe(pk);
    }
    return null;
  }, [pk]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-text">Payment Information</h3>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          <span className="ml-3 text-text-muted">Loading payment options...</span>
        </div>
      </div>
    );
  }

  if (!paymentIntent) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-text">Payment Information</h3>
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          Unable to load payment information. Please try again.
        </div>
      </div>
    );
  }

  if (!paymentIntent.client_secret || !paymentIntent.pk) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-text">Payment Information</h3>
        <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">
          Payment configuration is incomplete. Missing: {!paymentIntent.client_secret ? 'client_secret ' : ''}{!paymentIntent.pk ? 'publishable_key' : ''}
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-text-muted">Debug: Payment Intent Data</summary>
          <pre className="mt-2 overflow-auto rounded-md bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            {JSON.stringify(paymentIntent, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (!stripeInstance) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-text">Payment Information</h3>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          <span className="ml-3 text-text-muted">Initializing payment...</span>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0070f3',
      colorBackground: '#ffffff',
      colorText: '#1a1a1a',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-text">Payment Information</h3>
      {/* Key forces remount when payment intent changes */}
      <Elements
        key={paymentIntent.client_secret}
        stripe={stripeInstance}
        options={{
          clientSecret: paymentIntent.client_secret,
          appearance,
        }}
      >
        <CheckoutForm onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
}

export { PaymentForm as default };
