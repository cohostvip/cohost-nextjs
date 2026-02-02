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

export type SalesStatus =
    | { status: 'active' }
    | { status: 'ending-soon'; endsAt: Date; daysLeft: number }
    | { status: 'not-started'; startsAt: Date }
    | { status: 'ended' };

const ENDING_SOON_DAYS = 7;

export function getTicketSalesStatus(ticket: Ticket, eventStart?: Date): SalesStatus {
    const now = new Date();

    if (ticket.salesStart) {
        const startDate = new Date(ticket.salesStart);
        if (now < startDate) {
            return { status: 'not-started', startsAt: startDate };
        }
    }

    if (ticket.salesEnd) {
        const endDate = new Date(ticket.salesEnd);
        if (now > endDate) {
            return { status: 'ended' };
        }

        const daysUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        // Only show "ending soon" if sales end BEFORE the event starts
        // (or if eventStart is not provided)
        const showEndingSoon = !eventStart || endDate < eventStart;
        if (showEndingSoon && daysUntilEnd <= ENDING_SOON_DAYS) {
            return { status: 'ending-soon', endsAt: endDate, daysLeft: Math.ceil(daysUntilEnd) };
        }
    }

    return { status: 'active' };
}

export function formatSalesStartDate(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return 'soon';
    } else if (diffDays === 1) {
        return 'tomorrow';
    } else if (diffDays <= 7) {
        // Within a week: "Monday", "Tuesday", etc.
        return date.toLocaleDateString(undefined, { weekday: 'long' });
    } else if (diffDays <= 30) {
        // Within a month: "Jan 15"
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else if (date.getFullYear() === now.getFullYear()) {
        // Same year but more than a month away: "Jan 15"
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
        // Different year: "Jan '27"
        const year = date.getFullYear().toString().slice(-2);
        return `${date.toLocaleDateString(undefined, { month: 'short' })} '${year}`;
    }
}
