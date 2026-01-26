import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventInfoCard } from './EventInfoCard';

const meta: Meta<typeof EventInfoCard> = {
  title: 'Orders/EventInfoCard',
  component: EventInfoCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EventInfoCard>;

export const WithFullAddress: Story = {
  args: {
    context: {
      title: 'Bklyn NYE 26 El Nico Rooftop Williamsburg',
      start: '2026-01-01T01:00:00.000Z',
      end: '2026-01-01T07:00:00.000Z',
      location: {
        name: 'El Nico Rooftop',
        address: {
          formattedAddress: '288 N 8th St Brooklyn NY United States 11211',
        },
        timezone: 'America/New_York',
      },
      logo: {
        url: 'https://firebasestorage.googleapis.com/v0/b/getout-4e180.appspot.com/o/uploads%2Fevents%2Fevent-flyer-nyc-williamsburg-nye-penny-hotel-el-nico-square.jpg?alt=media&token=e31f4f55-9d70-418b-a89c-54e72558cdb1',
      },
    },
  },
};

export const WithoutAddress: Story = {
  args: {
    context: {
      title: 'EASY TIGER Speakeasy',
      start: '2025-08-24T02:00:00.000Z',
      end: '2025-08-24T07:00:00.000Z',
      location: {
        name: 'EASY TIGER',
        address: null,
        timezone: 'America/New_York',
      },
      logo: {
        url: 'https://firebasestorage.googleapis.com/v0/b/getout-4e180.appspot.com/o/uploads%2Fevents%2Fevent-flyer-easy-tiger-8_23-final-fr--2-.png?alt=media&token=c6e8d482-25c4-4859-9ad1-26936f860da3',
      },
    },
  },
};

export const WithoutEndTime: Story = {
  args: {
    context: {
      title: 'Summer Music Festival',
      start: '2025-07-15T18:00:00.000Z',
      location: {
        name: 'Central Park',
        address: {
          formattedAddress: 'Central Park, New York, NY',
        },
        timezone: 'America/New_York',
      },
      logo: {
        url: 'https://via.placeholder.com/200',
      },
    },
  },
};

export const WithoutLogo: Story = {
  args: {
    context: {
      title: 'Private Event',
      start: '2025-09-10T19:00:00.000Z',
      end: '2025-09-10T23:00:00.000Z',
      location: {
        name: 'Secret Location',
        timezone: 'America/New_York',
      },
    },
  },
};
