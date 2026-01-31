import type { Order } from '@/lib/api';

type Customer = Order['customer'];

interface CustomerInfoProps {
  customer: Customer;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-text">Customer Information</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="text-text-muted w-16">Name:</span>
          <span className="text-text">{customer.name}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-text-muted w-16">Email:</span>
          <span className="text-text">{customer.email}</span>
        </div>
        {customer.phone && (
          <div className="flex gap-2">
            <span className="text-text-muted w-16">Phone:</span>
            <span className="text-text">{customer.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
