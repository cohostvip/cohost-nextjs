'use client';

import { useState, useEffect } from 'react';
import {
  CohostCheckoutProvider,
  PaymentElementProvider,
  useCohostCheckout,
  formatCurrency,
} from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';
import { CartSummary } from './CartSummary';
import { CouponForm } from './CouponForm';
import { CustomerForm } from './CustomerForm';
import { PaymentForm } from './PaymentForm';

type CheckoutStep = 'customer' | 'payment' | 'confirmation';

interface TicketQuantities {
  [ticketId: string]: number;
}

interface CheckoutContentProps {
  onClose?: () => void;
  initialQuantities?: TicketQuantities;
}

function CheckoutContent({ onClose, initialQuantities }: CheckoutContentProps) {
  const { cartSession, placeOrder, processPayment, incrementItem, decrementItem } = useCohostCheckout();
  const [step, setStep] = useState<CheckoutStep>('customer');
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [hasSetInitialQuantities, setHasSetInitialQuantities] = useState(false);

  // Set initial quantities when cart session is available
  useEffect(() => {
    if (cartSession?.items && initialQuantities && !hasSetInitialQuantities) {
      const setQuantities = async () => {
        for (const item of cartSession.items) {
          const targetQty = initialQuantities[item.offering?.id] || 0;
          const currentQty = item.quantity;

          // Increment or decrement to reach target quantity
          if (targetQty > currentQty) {
            for (let i = 0; i < targetQty - currentQty; i++) {
              await incrementItem(item.id);
            }
          } else if (targetQty < currentQty) {
            for (let i = 0; i < currentQty - targetQty; i++) {
              await decrementItem(item.id);
            }
          }
        }
        setHasSetInitialQuantities(true);
      };
      setQuantities();
    }
  }, [cartSession?.items, initialQuantities, hasSetInitialQuantities, incrementItem, decrementItem]);

  const itemCount = cartSession?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cartSession?.costs?.total;
  const isFreeOrder = total === 'USD,0' || total === '0' || parseFloat(total?.replace(/[^0-9.-]/g, '') || '0') === 0;

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

  const handleEditTickets = () => {
    // Close modal to allow user to edit ticket selection
    onClose?.();
  };

  // Confirmation screen
  if (step === 'confirmation') {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
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
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden">
      {/* Two-column layout on desktop */}
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 md:flex-row md:gap-8 md:px-6">
        {/* Left column - Main content */}
        <div className="flex flex-1 flex-col overflow-hidden md:max-w-xl">
          {/* Step header - only title, no indicator */}
          <div className="py-4">
            <h2 className="text-xl font-bold text-text">
              {step === 'customer' && 'Your Information'}
              {step === 'payment' && 'Payment'}
            </h2>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                {error}
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

            {/* Desktop action buttons - directly below form content */}
            <div className="mt-6 hidden md:block">
              <div className="flex gap-3">
                {step === 'payment' && (
                  <Button
                    variant="secondary"
                    onClick={() => setStep('customer')}
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                )}

                {step === 'customer' && (
                  <Button
                    className="flex-1"
                    onClick={handleContinueToPayment}
                    disabled={!isCustomerValid || isProcessing || itemCount === 0}
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
        </div>

        {/* Right column - Order summary (desktop) */}
        <div className="hidden w-80 shrink-0 py-4 md:block">
          <div className="sticky top-4 space-y-4">
            <CartSummary onEditTickets={handleEditTickets} />
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom - Order summary */}
      <div className="border-t border-border bg-surface p-4 md:hidden">
        <CartSummary compact className="mb-3" onEditTickets={handleEditTickets} />

        <div className="flex gap-3">
          {step === 'payment' && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setStep('customer')}
              disabled={isProcessing}
            >
              Back
            </Button>
          )}

          {step === 'customer' && (
            <Button
              className="flex-1"
              onClick={handleContinueToPayment}
              disabled={!isCustomerValid || isProcessing || itemCount === 0}
            >
              {isProcessing ? 'Processing...' : isFreeOrder ? 'Complete Order' : 'Continue'}
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
  initialQuantities?: TicketQuantities;
}

export function CheckoutFlow({ cartSessionId, onClose, initialQuantities }: CheckoutFlowProps) {
  return (
    <CohostCheckoutProvider cartSessionId={cartSessionId}>
      <CheckoutContent onClose={onClose} initialQuantities={initialQuantities} />
    </CohostCheckoutProvider>
  );
}
