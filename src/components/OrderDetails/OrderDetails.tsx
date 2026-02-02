import type { Order } from '@/lib/api';
import { OrderHeader } from './OrderHeader';
import { EventInfoCard } from './EventInfoCard';
import { OrderItemsList } from './OrderItemsList';
import { OrderSummary } from './OrderSummary';
import { CustomerInfo } from './CustomerInfo';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const resolvedContext = order.meta?.resolvedContext;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="order-details">
      <OrderHeader
        orderNumber={order.orderNumber}
        status={order.status}
        created={order.created as string}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Event Info - Top on mobile, right side on desktop */}
        <div className="order-1 md:order-2 md:col-span-1 space-y-4">
          {/* Large Flyer - Only on md+ screens */}
          <div className="hidden md:block aspect-square overflow-hidden rounded-lg">
            {resolvedContext?.logo?.url ? (
              <img
                src={resolvedContext.logo.url}
                alt={resolvedContext.title || 'Event'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface">
                <span className="text-text-subtle">No image available</span>
              </div>
            )}
          </div>

          {/* Event Details - With small image on mobile, without image on desktop */}
          {resolvedContext && (
            <>
              <div className="md:hidden">
                <EventInfoCard context={resolvedContext} />
              </div>
              <div className="hidden md:block">
                <EventInfoCard context={resolvedContext} hideImage />
              </div>
            </>
          )}
        </div>

        {/* Order Info - Bottom on mobile, left side on desktop */}
        <div className="order-2 md:order-1 md:col-span-2 space-y-4">
          {/* Order Items */}
          {order.items.length > 0 && <OrderItemsList items={order.items} />}

          {/* Order Summary */}
          <OrderSummary costs={order.costs} />

          {/* Customer Info */}
          <CustomerInfo customer={order.customer} />
        </div>
      </div>
    </div>
  );
}
