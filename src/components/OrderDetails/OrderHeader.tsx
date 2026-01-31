'use client';

import type { Order } from '@/lib/api';

type OrderStatus = Order['status'];

interface OrderHeaderProps {
  orderNumber: string;
  status: OrderStatus;
  created: string;
}

// const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
//   placed: { label: 'Confirmed', className: 'bg-green-500/20 text-green-400' },
//   completed: { label: 'Completed', className: 'bg-green-500/20 text-green-400' },
//   attending: { label: 'Attending', className: 'bg-green-500/20 text-green-400' },
//   cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400' },
//   refunded: { label: 'Refunded', className: 'bg-red-500/20 text-red-400' },
//   pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400' },
//   started: { label: 'Started', className: 'bg-yellow-500/20 text-yellow-400' },
//   abandoned: { label: 'Abandoned', className: 'bg-gray-500/20 text-gray-400' },
// };

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // hour: 'numeric',
    // minute: '2-digit',
  });
}

export function OrderHeader({ orderNumber,  created }: OrderHeaderProps) {
  // const statusConfig = STATUS_CONFIG[status] || {
  //   label: status,
  //   className: 'bg-gray-500/20 text-gray-400',
  // };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-text ">
          Order #{orderNumber}
        </h1>

      </div>
      <p className="text-sm text-text-muted">Placed {formatDate(created)}</p>
    </div>
  );
}
