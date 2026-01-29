'use client';

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <OrderHeader
        orderNumber={order.orderNumber}
        status={order.status}
        created={order.created as string}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Event Flyer (desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="aspect-square overflow-hidden rounded-lg sticky top-24">
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
        </div>

        {/* Right Column - Order Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Event Info Card (shows flyer on mobile) */}
          {resolvedContext && <EventInfoCard context={resolvedContext} />}

          {/* Order Items */}
          {order.items.length > 0 && <OrderItemsList items={order.items} />}

          {/* Order Summary */}
          <OrderSummary costs={order.costs} />

          {/* Customer Info (collapsed by default) */}
          <CustomerInfo customer={order.customer} />
        </div>
      </div>
    </div>
  );
}
