'use client';

import { useState, useCallback } from 'react';
import {
  CohostCheckoutProvider,
  PaymentElementProvider,
  useCohostCheckout,
  formatCurrency,
} from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';
import { TicketSelector } from './TicketSelector';
import { CartSummary } from './CartSummary';
import { CouponForm } from './CouponForm';
import { CustomerForm } from './CustomerForm';
import { PaymentForm } from './PaymentForm';

type CheckoutStep = 'tickets' | 'customer' | 'payment' | 'confirmation';

interface CheckoutContentProps {
  onClose?: () => void;
}

function CheckoutContent({ onClose }: CheckoutContentProps) {
  const { cartSession, placeOrder, processPayment } = useCohostCheckout();
  const [step, setStep] = useState<CheckoutStep>('tickets');
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);

  const itemCount = cartSession?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cartSession?.costs?.total;
  const isFreeOrder = total === 'USD,0' || total === '0' || parseFloat(total?.replace(/[^0-9.-]/g, '') || '0') === 0;

  const handleContinueToCustomer = () => {
    if (itemCount === 0) {
      setError('Please select at least one ticket');
      return;
    }
    setError(null);
    setStep('customer');
  };

  const handleContinueToPayment = () => {
    if (!isCustomerValid) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);

    if (isFreeOrder) {
      handlePlaceOrder();
    } else {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await placeOrder();
      setOrderResult(result);
      setStep('confirmation');
    } catch (err: any) {
      setError(err?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentTokenized = async (tokenData: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      await processPayment(tokenData);
      const result = await placeOrder();
      setOrderResult(result);
      setStep('confirmation');
    } catch (err: any) {
      setError(err?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (step === 'confirmation') {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <h2 className="mb-2 text-2xl font-bold text-text">Order Confirmed!</h2>
        <p className="mb-6 text-text-muted">
          Thank you for your purchase. Your tickets have been sent to your email.
        </p>
        {orderResult?.id && (
          <p className="mb-4 text-sm text-text-subtle">
            Order ID: {orderResult.id}
          </p>
        )}
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">
            {step === 'tickets' && 'Select Tickets'}
            {step === 'customer' && 'Your Information'}
            {step === 'payment' && 'Payment'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="mt-4 flex gap-2">
          {['tickets', 'customer', 'payment'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                ['tickets', 'customer', 'payment'].indexOf(step) >= i
                  ? 'bg-accent'
                  : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {step === 'tickets' && (
          <div className="space-y-6">
            <TicketSelector />
            <CouponForm />
          </div>
        )}

        {step === 'customer' && (
          <CustomerForm onValidChange={setIsCustomerValid} />
        )}

        {step === 'payment' && (
          <PaymentElementProvider>
            <PaymentForm
              onTokenized={handlePaymentTokenized}
              onError={handlePaymentError}
            />
          </PaymentElementProvider>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <CartSummary className="mb-4" />

        <div className="flex gap-3">
          {step !== 'tickets' && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setStep(step === 'payment' ? 'customer' : 'tickets')}
              disabled={isProcessing}
            >
              Back
            </Button>
          )}

          {step === 'tickets' && (
            <Button
              className="flex-1"
              onClick={handleContinueToCustomer}
              disabled={itemCount === 0}
            >
              Continue
            </Button>
          )}

          {step === 'customer' && (
            <Button
              className="flex-1"
              onClick={handleContinueToPayment}
              disabled={!isCustomerValid || isProcessing}
            >
              {isProcessing ? 'Processing...' : isFreeOrder ? 'Complete Order' : 'Continue to Payment'}
            </Button>
          )}

          {step === 'payment' && (
            <Button
              className="flex-1"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CheckoutFlowProps {
  cartSessionId: string;
  onClose?: () => void;
}

export function CheckoutFlow({ cartSessionId, onClose }: CheckoutFlowProps) {
  return (
    <CohostCheckoutProvider cartSessionId={cartSessionId}>
      <CheckoutContent onClose={onClose} />
    </CohostCheckoutProvider>
  );
}
