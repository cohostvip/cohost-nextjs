import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OrderSummary } from './OrderSummary';

const meta: Meta<typeof OrderSummary> = {
  title: 'Orders/OrderSummary',
  component: OrderSummary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderSummary>;

export const FullCosts: Story = {
  args: {
    costs: {
      subtotal: 'USD,19800',
      fee: 'USD,2178',
      delivery: 'USD,295',
      discount: 'USD,0',
      tax: 'USD,0',
      gross: 'USD,22273',
      preDiscount: 'USD,19800',
      total: 'USD,22273',
    },
  },
};

export const FreeOrder: Story = {
  args: {
    costs: {
      subtotal: 'USD,0',
      fee: 'USD,0',
      delivery: 'USD,0',
      discount: 'USD,0',
      tax: 'USD,0',
      gross: 'USD,0',
      preDiscount: 'USD,0',
      total: 'USD,0',
    },
  },
};

export const WithDiscount: Story = {
  args: {
    costs: {
      subtotal: 'USD,25000',
      fee: 'USD,2750',
      delivery: 'USD,295',
      discount: 'USD,5000',
      tax: 'USD,0',
      gross: 'USD,28045',
      preDiscount: 'USD,25000',
      total: 'USD,23045',
    },
  },
};

export const WithTax: Story = {
  args: {
    costs: {
      subtotal: 'USD,10000',
      fee: 'USD,1100',
      delivery: 'USD,295',
      discount: 'USD,0',
      tax: 'USD,885',
      gross: 'USD,12280',
      preDiscount: 'USD,10000',
      total: 'USD,12280',
    },
  },
};

export const SubtotalOnly: Story = {
  args: {
    costs: {
      subtotal: 'USD,5000',
      fee: 'USD,0',
      delivery: 'USD,0',
      discount: 'USD,0',
      tax: 'USD,0',
      gross: 'USD,5000',
      preDiscount: 'USD,5000',
      total: 'USD,5000',
    },
  },
};
