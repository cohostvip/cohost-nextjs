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

export const Completed: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'completed',
    created: '2025-11-07T15:40:45.446Z',
  },
};

export const Cancelled: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'cancelled',
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

export const Pending: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'pending',
    created: '2025-11-07T15:40:45.446Z',
  },
};

export const Abandoned: Story = {
  args: {
    orderNumber: '29231296375',
    status: 'abandoned',
    created: '2025-11-07T15:40:45.446Z',
  },
};
