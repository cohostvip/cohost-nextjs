'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CohostCheckoutProvider,
  PaymentElementProvider,
  useCohostCheckout,
  useAuth,
} from '@cohostvip/cohost-react';
import { Button } from '@/components/ui';
import { CartSummary } from './CartSummary';
import { CouponForm } from './CouponForm';
import { CustomerForm } from './CustomerForm';
import { PaymentForm } from './PaymentForm';

const AUTO_REDIRECT_DELAY_MS = 60 * 1000; // 1 minute

type CheckoutStep = 'checkout' | 'confirmation';

// Response from placeOrder API
interface PlaceOrderResult {
  result: string;
  id: string;
  uid: string;
  redirUri: string;
  accessToken: string;
}

interface TicketQuantities {
  [ticketId: string]: number;
}

interface CheckoutContentProps {
  onClose?: () => void;
  onOrderComplete?: () => void;
  initialQuantities?: TicketQuantities;
}

function CheckoutContent({ onClose, onOrderComplete, initialQuantities }: CheckoutContentProps) {
  const router = useRouter();
  const { cartSession, placeOrder, processPayment, updateItem } = useCohostCheckout();
  const { authenticateWithToken } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('checkout');
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<PlaceOrderResult | null>(null);
  const initialQuantitiesSetRef = useRef(false);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set initial quantities when cart session is available
  useEffect(() => {
    if (!cartSession?.items || !initialQuantities || initialQuantitiesSetRef.current) {
      return;
    }

    // Mark as set immediately to prevent re-runs
    initialQuantitiesSetRef.current = true;

    const setQuantities = async () => {
      // Build a list of updates needed based on initial cart state
      const updates = cartSession.items
        .map((item) => ({
          itemId: item.id,
          targetQty: initialQuantities[item.offering?.id] || 0,
          currentQty: item.quantity,
        }))
        .filter(({ targetQty, currentQty }) => targetQty !== currentQty);

      // Apply updates sequentially (each updateItem returns updated cart)
      for (const { itemId, targetQty } of updates) {
        await updateItem(itemId, targetQty);
      }
    };

    setQuantities();
  }, [cartSession?.items, initialQuantities, updateItem]);

  const itemCount = cartSession?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cartSession?.costs?.total;
  const isFreeOrder = total === 'USD,0' || total === '0' || parseFloat(total?.replace(/[^0-9.-]/g, '') || '0') === 0;

  const handlePlaceOrder = async () => {
    if (!isCustomerValid) {
      setError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await placeOrder() as unknown as PlaceOrderResult | undefined;
      if (result) {
        setOrderResult(result);

        // Authenticate user with the access token from checkout response
        if (result.accessToken) {
          try {
            await authenticateWithToken(result.accessToken);
          } catch (authErr) {
            // Log but don't fail - user can still see confirmation
            console.warn('Failed to authenticate with order token:', authErr);
          }
        }
      }

      setStep('confirmation');
      // Notify parent that order is complete so it can refresh data
      onOrderComplete?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Payment already confirmed by Stripe, now place the order
      const result = await placeOrder() as unknown as PlaceOrderResult | undefined;
      console.log('[CheckoutFlow] placeOrder result:', JSON.stringify(result, null, 2));
      if (result) {
        setOrderResult(result);
        console.log('[CheckoutFlow] orderResult set:', { uid: result.uid, id: result.id, hasToken: !!result.accessToken });

        // Authenticate user with the access token from checkout response
        if (result.accessToken) {
          try {
            await authenticateWithToken(result.accessToken);
          } catch (authErr) {
            // Log but don't fail - user can still see confirmation
            console.warn('Failed to authenticate with order token:', authErr);
          }
        }
      } else {
        console.warn('[CheckoutFlow] placeOrder returned undefined/null');
      }

      setStep('confirmation');
      // Notify parent that order is complete so it can refresh data
      onOrderComplete?.();
    } catch (err: any) {
      console.error('[CheckoutFlow] placeOrder error:', err);
      setError(err?.message || 'Failed to complete order');
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

  // Build order confirmation URL: /account/orders/{uid}_{orderId}?token={accessToken}
  const orderConfirmationUrl = orderResult?.uid && orderResult?.id
    ? `/account/orders/${orderResult.uid}_${orderResult.id}${orderResult.accessToken ? `?token=${orderResult.accessToken}` : ''}`
    : null;

  // Redirect to order confirmation page
  const handleRedirectToOrder = () => {
    if (orderConfirmationUrl) {
      router.push(orderConfirmationUrl);
    } else {
      onClose?.();
    }
  };

  // Set up auto-redirect timer when confirmation screen is shown
  useEffect(() => {
    if (step === 'confirmation' && orderConfirmationUrl) {
      autoRedirectTimerRef.current = setTimeout(() => {
        router.push(orderConfirmationUrl);
      }, AUTO_REDIRECT_DELAY_MS);

      return () => {
        if (autoRedirectTimerRef.current) {
          clearTimeout(autoRedirectTimerRef.current);
        }
      };
    }
  }, [step, orderConfirmationUrl, router]);

  // Confirmation screen
  if (step === 'confirmation') {
    return (
      <div className="flex flex-1 items-center justify-center p-6" data-testid="order-confirmation">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-text">Order Confirmed!</h2>
          <p className="mb-6 text-text-muted">
            Thank you for your purchase. Your tickets have been sent to your email.
          </p>
          {orderResult?.id && (
            <p className="mb-4 text-sm text-text-subtle" data-testid="order-confirmation-id">
              Order ID: {orderResult.id}
            </p>
          )}
          <Button onClick={handleRedirectToOrder} data-testid="view-order-button">View Order</Button>
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
          {/* Header */}
          <div className="py-4">
            <h2 className="text-xl font-bold text-text">Checkout</h2>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 space-y-6 overflow-y-auto">
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Customer Info */}
            <CustomerForm onValidChange={setIsCustomerValid} />

            {/* Payment - show immediately to start fetching payment intent */}
            {!isFreeOrder && (
              <PaymentElementProvider>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={!isCustomerValid}
                />
              </PaymentElementProvider>
            )}

            {/* Complete Order button for free orders (desktop) */}
            {isFreeOrder && (
              <div className="hidden md:block">
                <Button
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={!isCustomerValid || isProcessing || itemCount === 0}
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                </Button>
              </div>
            )}
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

        {/* Complete Order button for free orders (mobile) */}
        {isFreeOrder && (
          <Button
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={!isCustomerValid || isProcessing || itemCount === 0}
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </Button>
        )}
        {/* Payment submit button is integrated in PaymentForm for paid orders */}
      </div>
    </div>
  );
}

interface CheckoutFlowProps {
  cartSessionId: string;
  onClose?: () => void;
  onOrderComplete?: () => void;
  initialQuantities?: TicketQuantities;
}

export function CheckoutFlow({ cartSessionId, onClose, onOrderComplete, initialQuantities }: CheckoutFlowProps) {
  return (
    <CohostCheckoutProvider cartSessionId={cartSessionId}>
      <CheckoutContent onClose={onClose} onOrderComplete={onOrderComplete} initialQuantities={initialQuantities} />
    </CohostCheckoutProvider>
  );
}
