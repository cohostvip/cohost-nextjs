import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TicketListItem } from '../TicketListItem';
import type { Ticket } from '@/lib/api';

const meta: Meta<typeof TicketListItem> = {
  title: 'UI/TicketsList/TicketListItem',
  component: TicketListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md bg-background p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onQuantityChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TicketListItem>;

const baseTicket: Ticket = {
  id: 'ticket-1',
  name: 'General Admission',
  type: 'admission',
  status: 'live',
  priceCategory: 'paid',
  sorting: 1,
  minimumQuantity: 1,
  maximumQuantity: 10,
  costs: {
    cost: 'USD,2500',
    fee: 'USD,275',
    total: 'USD,2775',
  },
} as Ticket;

export const Default: Story = {
  args: {
    ticket: baseTicket,
    quantity: 0,
  },
};

export const WithQuantitySelected: Story = {
  args: {
    ticket: baseTicket,
    quantity: 2,
  },
};

export const FreeTicket: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-free',
      name: 'Free RSVP',
      priceCategory: 'free',
      costs: {
        cost: 'USD,0',
        fee: 'USD,0',
        total: 'USD,0',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const SoldOut: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-soldout',
      name: 'VIP Table',
      status: 'sold-out',
      costs: {
        cost: 'USD,15000',
        fee: 'USD,1650',
        total: 'USD,16650',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const WithFees: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-fees',
      name: 'Premium Entry',
      costs: {
        cost: 'USD,5000',
        fee: 'USD,550',
        total: 'USD,5550',
      },
    } as Ticket,
    quantity: 1,
  },
};

export const NoFees: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-nofees',
      name: 'Early Bird Special',
      costs: {
        cost: 'USD,3500',
        fee: 'USD,0',
        total: 'USD,3500',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const WithShortDescription: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-desc',
      name: 'VIP Package',
      description: 'Includes priority entry and a complimentary drink.',
      costs: {
        cost: 'USD,7500',
        fee: 'USD,825',
        total: 'USD,8325',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const WithLongDescription: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-longdesc',
      name: 'Ultimate VIP Experience',
      description: `<p>The Ultimate VIP Experience includes:</p>
        <ul>
          <li>Priority entry with no wait</li>
          <li>Access to exclusive VIP lounge area</li>
          <li>Complimentary bottle service</li>
          <li>Personal concierge service throughout the night</li>
          <li>Meet and greet with the performers</li>
          <li>Exclusive merchandise package</li>
        </ul>
        <p>This package is perfect for those who want the complete premium experience at our venue.</p>`,
      costs: {
        cost: 'USD,25000',
        fee: 'USD,2750',
        total: 'USD,27750',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const WithMinimumQuantity: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-min',
      name: 'Group Package (Min 4)',
      minimumQuantity: 4,
      maximumQuantity: 10,
      description: 'Minimum purchase of 4 tickets required.',
      costs: {
        cost: 'USD,2000',
        fee: 'USD,220',
        total: 'USD,2220',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const WithStepIncrement: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-step',
      name: 'Table for 2',
      step: 2,
      minimumQuantity: 2,
      maximumQuantity: 8,
      description: 'Tables are sold in pairs.',
      costs: {
        cost: 'USD,10000',
        fee: 'USD,1100',
        total: 'USD,11100',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const HighPriceTicket: Story = {
  args: {
    ticket: {
      ...baseTicket,
      id: 'ticket-high',
      name: 'Platinum VIP Suite',
      costs: {
        cost: 'USD,100000',
        fee: 'USD,11000',
        total: 'USD,111000',
      },
    } as Ticket,
    quantity: 1,
  },
};

// Sales date scenarios
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const SalesNotStartedTomorrow: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-upcoming-tomorrow',
      name: 'Early Bird (Coming Soon)',
      salesStart: tomorrow.toISOString(),
      salesEnd: new Date('2099-12-31').toISOString(),
      costs: {
        cost: 'USD,1500',
        fee: 'USD,165',
        total: 'USD,1665',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const SalesNotStartedNextWeek: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-upcoming-week',
      name: 'VIP Pre-Sale',
      salesStart: nextWeek.toISOString(),
      salesEnd: new Date('2099-12-31').toISOString(),
      costs: {
        cost: 'USD,5000',
        fee: 'USD,550',
        total: 'USD,5550',
      },
    } as Ticket,
    quantity: 0,
  },
};

// Sales ending soon scenarios
const inThreeDays = new Date();
inThreeDays.setDate(inThreeDays.getDate() + 3);

const inOneDay = new Date();
inOneDay.setDate(inOneDay.getDate() + 1);

export const SalesEndingSoon: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-ending-soon',
      name: 'Early Bird Special',
      salesStart: new Date('2024-01-01').toISOString(),
      salesEnd: inThreeDays.toISOString(),
      costs: {
        cost: 'USD,2000',
        fee: 'USD,220',
        total: 'USD,2220',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const SalesEndingLastDay: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-last-day',
      name: 'Flash Sale',
      salesStart: new Date('2024-01-01').toISOString(),
      salesEnd: inOneDay.toISOString(),
      costs: {
        cost: 'USD,1500',
        fee: 'USD,165',
        total: 'USD,1665',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const SalesEnded: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-ended',
      name: 'Early Bird Special',
      salesStart: new Date('2024-01-01').toISOString(),
      salesEnd: yesterday.toISOString(),
      costs: {
        cost: 'USD,2000',
        fee: 'USD,220',
        total: 'USD,2220',
      },
    } as Ticket,
    quantity: 0,
  },
};

const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

export const SalesNotStartedNextMonth: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-upcoming-month',
      name: 'Summer Special',
      salesStart: nextMonth.toISOString(),
      salesEnd: new Date('2099-12-31').toISOString(),
      costs: {
        cost: 'USD,3500',
        fee: 'USD,385',
        total: 'USD,3885',
      },
    } as Ticket,
    quantity: 0,
  },
};

export const SalesNotStartedNextYear: Story = {
  args: {
    showSalesStatus: true,
    ticket: {
      ...baseTicket,
      id: 'ticket-upcoming-year',
      name: 'NYE 2027 Early Access',
      salesStart: nextYear.toISOString(),
      salesEnd: new Date('2099-12-31').toISOString(),
      costs: {
        cost: 'USD,15000',
        fee: 'USD,1650',
        total: 'USD,16650',
      },
    } as Ticket,
    quantity: 0,
  },
};
