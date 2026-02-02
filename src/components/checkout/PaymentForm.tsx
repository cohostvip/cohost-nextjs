'use client';

import { useState, useMemo } from 'react';
import { loadStripe, Stripe, PaymentIntent } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { usePaymentElement } from '@cohostvip/cohost-react';

interface PaymentFormProps {
  className?: string;
  onSuccess?: (result: PaymentIntent) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

// Cache stripe instances by publishable key
const stripeCache = new Map<string, Promise<Stripe | null>>();

const getStripe = (publishableKey: string) => {
  if (!stripeCache.has(publishableKey)) {
    stripeCache.set(publishableKey, loadStripe(publishableKey));
  }
  return stripeCache.get(publishableKey)!;
};

// Style for the combined CardElement
const cardElementOptions = {
  style: {
    base: {
      color: '#fafafa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
      '::placeholder': {
        color: '#a3a3a3',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
  hidePostalCode: true,
};

// Inner form component that uses Stripe hooks
function CheckoutForm({
  onSuccess,
  onError,
  clientSecret,
  disabled,
}: {
  onSuccess?: (result: PaymentIntent) => void;
  onError?: (error: string) => void;
  clientSecret: string;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCardReady, setIsCardReady] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const handleCardChange = (event: any) => {
    // Track whether the card input is complete and valid
    setIsCardComplete(event.complete);
    // Clear any previous error when user makes changes
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
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
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="payment-form">
      {/* Single combined card input field */}
      <div className="relative rounded-lg border border-[#333] bg-[#1f1f1f] px-4 py-3" data-testid="payment-card-container">
        {/* Loading overlay until CardElement is ready */}
        {!isCardReady && (
          <div className="absolute inset-0 flex items-center rounded-lg bg-[#1f1f1f] px-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
            <span className="ml-2 text-sm text-text-muted">Loading...</span>
          </div>
        )}
        <CardElement
          options={cardElementOptions}
          onReady={() => setIsCardReady(true)}
          onChange={handleCardChange}
        />
      </div>

      {errorMessage && (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400" data-testid="payment-error">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={disabled || !stripe || !isCardReady || !isCardComplete || isProcessing}
        className="w-full rounded-md bg-accent px-4 py-3 font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="payment-submit"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export function PaymentForm({ className, onSuccess, onError, disabled }: PaymentFormProps) {
  const { paymentIntent, isLoading } = usePaymentElement();


  // Memoize stripe instance based on publishable key
  const pk = paymentIntent?.pk;
  const stripeInstance = useMemo(() => {
    if (pk) {
      return getStripe(pk);
    }
    return null;
  }, [pk]);

  if (isLoading || !stripeInstance) {
    return (
      <div className={`space-y-3 ${className || ''}`}>
        <label className="block text-sm font-medium text-text">Card</label>
        <div className="flex items-center rounded-lg border border-[#333] bg-[#1f1f1f] px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
          <span className="ml-2 text-sm text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  if (!paymentIntent || !paymentIntent.client_secret || !paymentIntent.pk) {
    return (
      <div className={`space-y-3 ${className || ''}`}>
        <label className="block text-sm font-medium text-text">Card</label>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Unable to load payment. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <label className="block text-sm font-medium text-text">Card</label>
      {/* Key forces remount when payment intent changes */}
      <Elements
        key={paymentIntent.client_secret}
        stripe={stripeInstance}
        options={{
          clientSecret: paymentIntent.client_secret,
        }}
      >
        <CheckoutForm
          onSuccess={onSuccess}
          onError={onError}
          clientSecret={paymentIntent.client_secret}
          disabled={disabled}
        />
      </Elements>
    </div>
  );
}

export { PaymentForm as default };
