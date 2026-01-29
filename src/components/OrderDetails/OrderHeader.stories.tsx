import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OrderHeader } from './OrderHeader';

const meta: Meta<typeof OrderHeader> = {
  title: 'Orders/OrderHeader',
  component: OrderHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderHeader>;

export const Placed: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'placed',
    created: '2025-11-07T15:40:45.446Z',
  },
};

export const Voided: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'voided',
    created: '2025-11-07T15:40:45.446Z',
  },
};

export const Refunded: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'refunded',
    created: '2025-11-07T15:40:45.446Z',
  },
};
