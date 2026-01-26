import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OrderDetails } from './OrderDetails';
import orderWithGroup from '../../../__mocks__/order-artifact-1.json';
import orderSimple from '../../../__mocks__/order-artifact-2.json';

const meta: Meta<typeof OrderDetails> = {
  title: 'Orders/OrderDetails',
  component: OrderDetails,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderDetails>;

export const WithGroupId: Story = {
  args: {
    order: orderWithGroup as any,
  },
};

export const SimpleOrder: Story = {
  args: {
    order: orderSimple as any,
  },
};
