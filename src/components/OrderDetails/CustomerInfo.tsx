'use client';

import { useState } from 'react';
import type { Order } from '@/lib/api';

type Customer = Order['customer'];

interface CustomerInfoProps {
  customer: Customer;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-lg font-semibold text-text">Customer Information</h2>
        <svg
          className={`w-5 h-5 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
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
      )}
    </div>
  );
}
