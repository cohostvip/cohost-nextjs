import type { Ticket } from '@/lib/api';

// Extended ticket type that may include offering group ID
export interface TicketWithGroup extends Ticket {
    offeringGroupId?: string;
}

export interface TicketGroup {
    id: string;
    name: string;
    description?: string;
    sorting: number;
    status: 'live' | 'sold-out' | 'hidden';
}

export interface TicketQuantities {
    [ticketId: string]: number;
}

export interface TicketsListProps {
    tickets: Ticket[];
    ticketGroups?: TicketGroup[];
    onGetTickets: (quantities: TicketQuantities) => void;
    isLoading?: boolean;
    className?: string;
    /** Show sales status badges (ending soon, not started, ended). Default: false */
    showSalesStatus?: boolean;
    /** Event start date - used to hide "ending soon" if sales end after event starts */
    eventStart?: string | Date;
}

export interface TicketItemProps {
    ticket: Ticket;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    /** Show sales status badges (ending soon, not started, ended). Default: false */
    showSalesStatus?: boolean;
    /** Event start date - used to hide "ending soon" if sales end after event starts */
    eventStart?: Date;
}
