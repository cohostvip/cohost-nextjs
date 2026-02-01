'use client';

import { useEffect } from 'react';
import { CheckoutFlow } from './CheckoutFlow';

interface TicketQuantities {
  [ticketId: string]: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete?: () => void;
  cartSessionId: string;
  initialQuantities?: TicketQuantities;
}

export function CheckoutModal({ isOpen, onClose, onOrderComplete, cartSessionId, initialQuantities }: CheckoutModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Glass-morphism backdrop */}
      <div
        className="absolute inset-0 bg-background/85 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Logo - absolute top-left */}
      <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
        <span className="text-xl font-bold text-text">Cohost</span>
      </div>

      {/* Close button - absolute top-right */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-text-muted transition-colors hover:bg-surface hover:text-text md:right-6 md:top-6"
        aria-label="Close checkout"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Modal content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Main content area - centered with max width */}
        <div className="flex flex-1 flex-col overflow-hidden pt-16 md:pt-20">
          <CheckoutFlow cartSessionId={cartSessionId} onClose={onClose} onOrderComplete={onOrderComplete} initialQuantities={initialQuantities} />
        </div>

        {/* Footer links */}
        <div className="relative z-10 border-t border-border/50 bg-background/50 px-4 py-3 text-center text-xs text-text-subtle backdrop-blur-sm">
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-muted hover:underline"
          >
            Terms of Service
          </a>
          <span className="mx-2">·</span>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-muted hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
