import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TicketsList } from '../TicketsList';
import type { Ticket } from '@/lib/api';
import type { TicketGroup } from '../types';

const meta: Meta<typeof TicketsList> = {
  title: 'UI/TicketsList/TicketsList',
  component: TicketsList,
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
    onGetTickets: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TicketsList>;

// Helper to create costs object
const createCosts = (cost: number, fee: number) => ({
  cost: `USD,${cost}`,
  fee: `USD,${fee}`,
  delivery: 'USD,0',
  tax: 'USD,0',
  gross: `USD,${cost + fee}`,
  total: `USD,${cost + fee}`,
});

// Helper to create tickets
const createTicket = (overrides: Partial<Ticket> & { id: string; name: string }): Ticket => ({
  type: 'admission',
  status: 'live',
  priceCategory: 'paid',
  sorting: 1,
  minimumQuantity: 1,
  maximumQuantity: 10,
  costs: createCosts(2500, 275),
  ...overrides,
} as Ticket);

// Date helpers
const inThreeDays = new Date();
inThreeDays.setDate(inThreeDays.getDate() + 3);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// Sample tickets
const basicTickets: Ticket[] = [
  createTicket({
    id: 'ga',
    name: 'General Admission',
    sorting: 1,
  }),
  createTicket({
    id: 'vip',
    name: 'VIP Entry',
    sorting: 2,
    costs: createCosts(5000, 550),
  }),
  createTicket({
    id: 'table',
    name: 'VIP Table (4 guests)',
    sorting: 3,
    minimumQuantity: 1,
    maximumQuantity: 5,
    costs: createCosts(50000, 5500),
  }),
];

export const Default: Story = {
  args: {
    tickets: basicTickets,
  },
};

export const WithFreeTicket: Story = {
  args: {
    tickets: [
      createTicket({
        id: 'free-rsvp',
        name: 'Free RSVP',
        sorting: 0,
        priceCategory: 'free',
        costs: createCosts(0, 0),
      }),
      ...basicTickets,
    ],
  },
};

export const WithSoldOutTickets: Story = {
  args: {
    tickets: [
      createTicket({
        id: 'early-bird',
        name: 'Early Bird (Sold Out)',
        sorting: 0,
        status: 'sold-out',
        costs: createCosts(1500, 165),
      }),
      ...basicTickets,
    ],
  },
};

export const AllSoldOut: Story = {
  args: {
    tickets: basicTickets.map((t) => ({ ...t, status: 'sold-out' } as Ticket)),
  },
};

export const Loading: Story = {
  args: {
    tickets: basicTickets,
    isLoading: true,
  },
};

export const WithEndingSoon: Story = {
  args: {
    showSalesStatus: true,
    tickets: [
      createTicket({
        id: 'flash-sale',
        name: 'Flash Sale',
        sorting: 0,
        salesStart: new Date('2024-01-01').toISOString(),
        salesEnd: tomorrow.toISOString(),
        costs: createCosts(1500, 165),
      }),
      createTicket({
        id: 'early-bird',
        name: 'Early Bird',
        sorting: 1,
        salesStart: new Date('2024-01-01').toISOString(),
        salesEnd: inThreeDays.toISOString(),
        costs: createCosts(2000, 220),
      }),
      ...basicTickets,
    ],
  },
};

export const WithSalesNotStarted: Story = {
  args: {
    showSalesStatus: true,
    tickets: [
      ...basicTickets,
      createTicket({
        id: 'presale',
        name: 'VIP Pre-Sale',
        sorting: 4,
        salesStart: nextWeek.toISOString(),
        salesEnd: new Date('2099-12-31').toISOString(),
        costs: createCosts(4000, 440),
      }),
    ],
  },
};

export const AllSalesNotStarted: Story = {
  args: {
    showSalesStatus: true,
    tickets: [
      createTicket({
        id: 'early-bird',
        name: 'Early Bird',
        sorting: 1,
        salesStart: nextWeek.toISOString(),
        salesEnd: new Date('2099-12-31').toISOString(),
        costs: createCosts(1500, 165),
      }),
      createTicket({
        id: 'ga',
        name: 'General Admission',
        sorting: 2,
        salesStart: nextWeek.toISOString(),
        salesEnd: new Date('2099-12-31').toISOString(),
        costs: createCosts(2500, 275),
      }),
      createTicket({
        id: 'vip',
        name: 'VIP Entry',
        sorting: 3,
        salesStart: nextWeek.toISOString(),
        salesEnd: new Date('2099-12-31').toISOString(),
        costs: createCosts(5000, 550),
      }),
    ],
  },
};

export const MixedStatuses: Story = {
  args: {
    showSalesStatus: true,
    tickets: [
      createTicket({
        id: 'sold-out',
        name: 'Super Early Bird',
        sorting: 0,
        status: 'sold-out',
        costs: createCosts(1000, 110),
      }),
      createTicket({
        id: 'ending-soon',
        name: 'Early Bird',
        sorting: 1,
        salesStart: new Date('2024-01-01').toISOString(),
        salesEnd: inThreeDays.toISOString(),
        costs: createCosts(1500, 165),
      }),
      createTicket({
        id: 'ga',
        name: 'General Admission',
        sorting: 2,
      }),
      createTicket({
        id: 'coming-soon',
        name: 'VIP Pre-Sale',
        sorting: 3,
        salesStart: nextWeek.toISOString(),
        salesEnd: new Date('2099-12-31').toISOString(),
        costs: createCosts(5000, 550),
      }),
      createTicket({
        id: 'ended',
        name: 'Flash Sale',
        sorting: 4,
        salesStart: new Date('2024-01-01').toISOString(),
        salesEnd: yesterday.toISOString(),
        costs: createCosts(1200, 132),
      }),
    ],
  },
};

// With groups
const ticketGroups: TicketGroup[] = [
  {
    id: 'general',
    name: 'General Admission',
    description: 'Standard entry tickets',
    sorting: 1,
    status: 'live',
  },
  {
    id: 'vip',
    name: 'VIP Packages',
    description: 'Premium experiences with exclusive perks',
    sorting: 2,
    status: 'live',
  },
];

const groupedTickets: Ticket[] = [
  createTicket({
    id: 'ga-standard',
    name: 'Standard Entry',
    sorting: 1,
    offeringGroupId: 'general',
  } as any),
  createTicket({
    id: 'ga-early',
    name: 'Early Entry (9pm)',
    sorting: 2,
    offeringGroupId: 'general',
    costs: createCosts(3500, 385),
  } as any),
  createTicket({
    id: 'vip-entry',
    name: 'VIP Entry',
    sorting: 1,
    offeringGroupId: 'vip',
    description: 'Skip the line, complimentary drink',
    costs: createCosts(7500, 825),
  } as any),
  createTicket({
    id: 'vip-table',
    name: 'VIP Table (4 guests)',
    sorting: 2,
    offeringGroupId: 'vip',
    description: 'Reserved table with bottle service',
    costs: createCosts(50000, 5500),
  } as any),
];

export const WithGroups: Story = {
  args: {
    tickets: groupedTickets,
    ticketGroups,
  },
};

export const WithGroupsAndMixedStatuses: Story = {
  args: {
    showSalesStatus: true,
    tickets: [
      createTicket({
        id: 'ga-early-bird',
        name: 'Early Bird',
        sorting: 0,
        offeringGroupId: 'general',
        status: 'sold-out',
        costs: createCosts(1500, 165),
      } as any),
      ...groupedTickets,
      createTicket({
        id: 'vip-platinum',
        name: 'Platinum Table',
        sorting: 3,
        offeringGroupId: 'vip',
        salesStart: nextWeek.toISOString(),
        salesEnd: new Date('2099-12-31').toISOString(),
        costs: createCosts(100000, 11000),
      } as any),
    ],
    ticketGroups,
  },
};

export const SingleTicket: Story = {
  args: {
    tickets: [basicTickets[0]],
  },
};

export const WithDescriptions: Story = {
  args: {
    tickets: [
      createTicket({
        id: 'ga',
        name: 'General Admission',
        sorting: 1,
        description: 'Entry after 10pm. Must be 21+.',
      }),
      createTicket({
        id: 'vip',
        name: 'VIP Entry',
        sorting: 2,
        description: 'Skip the line with expedited entry. Includes one complimentary drink ticket and access to the VIP lounge area.',
        costs: createCosts(5000, 550),
      }),
      createTicket({
        id: 'table',
        name: 'VIP Table Package',
        sorting: 3,
        description: `<p>The ultimate VIP experience includes:</p>
          <ul>
            <li>Reserved table for up to 4 guests</li>
            <li>Premium bottle service</li>
            <li>Dedicated server</li>
            <li>Complimentary champagne toast at midnight</li>
          </ul>`,
        costs: createCosts(50000, 5500),
      }),
    ],
  },
};

// Date helpers for eventStart stories
const eventInTwoDays = new Date();
eventInTwoDays.setDate(eventInTwoDays.getDate() + 2);

const eventInTenDays = new Date();
eventInTenDays.setDate(eventInTenDays.getDate() + 10);

/**
 * When salesEnd > eventStart, "ending soon" badges are suppressed.
 * This prevents showing "3 days left" when sales end after the event starts.
 * "Sales ended" is still shown if sales have already ended.
 */
export const WithEventStartSuppressesEndingSoon: Story = {
  args: {
    showSalesStatus: true,
    eventStart: eventInTwoDays,
    tickets: [
      createTicket({
        id: 'early-bird',
        name: 'Early Bird',
        sorting: 1,
        salesStart: new Date('2024-01-01').toISOString(),
        // Sales end in 3 days, but event is in 2 days - no "ending soon" badge
        salesEnd: inThreeDays.toISOString(),
        costs: createCosts(1500, 165),
      }),
      createTicket({
        id: 'ga',
        name: 'General Admission',
        sorting: 2,
        // No salesEnd - always active
      }),
    ],
  },
};

/**
 * When salesEnd < eventStart, "ending soon" badges ARE shown.
 * This is the expected behavior when early bird sales end before the event.
 */
export const WithEventStartShowsEndingSoon: Story = {
  args: {
    showSalesStatus: true,
    eventStart: eventInTenDays,
    tickets: [
      createTicket({
        id: 'early-bird',
        name: 'Early Bird',
        sorting: 1,
        salesStart: new Date('2024-01-01').toISOString(),
        // Sales end in 3 days, event is in 10 days - shows "ending soon"
        salesEnd: inThreeDays.toISOString(),
        costs: createCosts(1500, 165),
      }),
      createTicket({
        id: 'ga',
        name: 'General Admission',
        sorting: 2,
      }),
    ],
  },
};
