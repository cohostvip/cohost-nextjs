'use client';

import { useState } from 'react';
import type { Ticket } from '@/lib/api';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { TicketItemProps } from './types';
import { formatTicketPrice, isTicketSoldOut } from './utils';



function TicketDetailsModal({
    ticket,
    isOpen,
    onClose
}: {
    ticket: Ticket;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-muted hover:text-text"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="mb-4 text-xl font-bold text-text">{ticket.name}</h3>
                {ticket.description && (
                    <div
                        className="prose prose-invert max-w-none text-text-muted"
                        dangerouslySetInnerHTML={{ __html: ticket.description }}
                    />
                )}
            </div>
        </div>
    );
}



export function TicketListItem({ ticket, quantity, onQuantityChange }: TicketItemProps) {
    const [showModal, setShowModal] = useState(false);
    const isSoldOut = isTicketSoldOut(ticket);
    const { price, hasFees } = formatTicketPrice(ticket);

    // Get min/max from ticket, with sensible defaults
    const minQty = ticket.minimumQuantity ?? 1;
    const maxQty = ticket.maximumQuantity ?? Infinity;

    // Strip HTML tags for preview and check if content is long
    const stripHtml = (html: string) => {
        const div = typeof document !== 'undefined' ? document.createElement('div') : null;
        if (div) {
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        }
        return html.replace(/<[^>]*>/g, '');
    };

    const plainDescription = ticket.description ? stripHtml(ticket.description) : '';
    const hasLongDescription = plainDescription.length > 150;

    return (
        <>
            <div className={`py-4 ${isSoldOut ? 'opacity-60' : ''}`}>
                {/* First row: name+price left, qty right */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-text">{ticket.name}</h4>
                            {isSoldOut && (
                                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                                    Sold Out
                                </span>
                            )}
                        </div>
                        <p className={`mt-1 text-sm ${isSoldOut ? 'text-text-muted' : 'text-accent'}`}>
                            {price}
                            {hasFees && price !== 'Free' && (
                                <span className="ml-1 text-xs text-text-muted">(incl. fees)</span>
                            )}
                        </p>
                    </div>

                    {/* Quantity selector */}
                    <QuantitySelector
                        qty={quantity}
                        min={minQty}
                        max={maxQty}
                        onChange={onQuantityChange}
                        disabled={isSoldOut}
                        size="md"
                    />
                </div>

                {/* Second row: description snippet */}
                {ticket.description && (
                    <div className="mt-1">
                        <p className="text-xs text-text-subtle line-clamp-2">
                            {plainDescription}
                        </p>
                        {hasLongDescription && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-0.5 text-xs text-accent hover:underline"
                            >
                                View more
                            </button>
                        )}
                    </div>
                )}
            </div>

            <TicketDetailsModal
                ticket={ticket}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}
