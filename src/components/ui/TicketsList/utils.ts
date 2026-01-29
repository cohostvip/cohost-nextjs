import { formatCurrency } from '@cohostvip/cohost-react';
import type { Ticket } from '@/lib/api';

export function formatTicketPrice(ticket: Ticket): { price: string; hasFees: boolean } {
    if (ticket.priceCategory === 'free') {
        return { price: 'Free', hasFees: false };
    }

    const total = ticket.costs?.total;
    const cost = ticket.costs?.cost;
    const fee = ticket.costs?.fee;

    if (!total && !cost) return { price: 'Free', hasFees: false };

    const priceValue = total || cost;

    const parts = priceValue?.split(',');
    if (parts && parts.length === 2) {
        const value = parseInt(parts[1], 10);
        if (value === 0) return { price: 'Free', hasFees: false };
    }

    const hasFees = fee ? parseInt(fee.split(',')[1] || '0', 10) > 0 : false;

    return {
        price: formatCurrency(priceValue) || 'Free',
        hasFees
    };
}

export function isTicketSoldOut(ticket: Ticket): boolean {
    return ticket.status === 'sold-out';
}
