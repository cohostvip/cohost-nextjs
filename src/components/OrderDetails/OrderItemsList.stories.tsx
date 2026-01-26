import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OrderItemsList } from './OrderItemsList';

const meta: Meta<typeof OrderItemsList> = {
  title: 'Orders/OrderItemsList',
  component: OrderItemsList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderItemsList>;

export const SingleItem: Story = {
  args: {
    items: [
      {
        id: '092efffb-646e-4f81-9ddb-0add4b5af621',
        quantity: 1,
        purchaseGroupId: null,
        offering: {
          id: 'XD0rlumvjAGkoli1csG8',
          name: 'FREE RSVP ENTRY BEFORE 11 PM',
          type: 'admission',
          description: '',
          sorting: 1,
          refPath: 'events/02whQu3e1koABNLbbw6d/tickets/XD0rlumvjAGkoli1csG8',
          category: 'General Admission',
        },
        costs: {
          cost: 'USD,0',
          subtotal: 'USD,0',
          fee: 'USD,0',
          delivery: 'USD,0',
          discount: 'USD,0',
          tax: 'USD,0',
          gross: 'USD,0',
          preDiscount: 'USD,0',
          total: 'USD,0',
        },
      } as any,
    ],
  },
};

export const MultipleQuantity: Story = {
  args: {
    items: [
      {
        id: '36c7c16f-4965-47e8-9c00-0edb96b5dcc9',
        quantity: 2,
        purchaseGroupId: 'EHOBBS3676',
        offering: {
          id: 'iklDCcHZvsdOLyarHaLT',
          name: 'Seated VIP',
          type: 'admission',
          description: '',
          sorting: 3,
          refPath: 'events/3S91k91A6qEmPYXKufyN/tickets/iklDCcHZvsdOLyarHaLT',
          category: 'General Admission',
        },
        costs: {
          cost: 'USD,9900',
          subtotal: 'USD,19800',
          fee: 'USD,1089',
          delivery: 'USD,0',
          discount: 'USD,0',
          tax: 'USD,0',
          gross: 'USD,21978',
          preDiscount: 'USD,21978',
          total: 'USD,21978',
        },
      } as any,
    ],
  },
};

export const MultipleItems: Story = {
  args: {
    items: [
      {
        id: 'item-1',
        quantity: 2,
        purchaseGroupId: 'GRP123',
        offering: {
          id: 'vip-1',
          name: 'VIP Table',
          type: 'admission',
          description: '',
          sorting: 1,
          refPath: 'events/123/tickets/vip-1',
          category: 'VIP',
        },
        costs: {
          cost: 'USD,15000',
          subtotal: 'USD,30000',
          fee: 'USD,3300',
          delivery: 'USD,0',
          discount: 'USD,0',
          tax: 'USD,0',
          gross: 'USD,33300',
          preDiscount: 'USD,33300',
          total: 'USD,33300',
        },
      } as any,
      {
        id: 'item-2',
        quantity: 1,
        purchaseGroupId: null,
        offering: {
          id: 'ga-1',
          name: 'General Admission',
          type: 'admission',
          description: '',
          sorting: 2,
          refPath: 'events/123/tickets/ga-1',
          category: 'General Admission',
        },
        costs: {
          cost: 'USD,5000',
          subtotal: 'USD,5000',
          fee: 'USD,550',
          delivery: 'USD,0',
          discount: 'USD,0',
          tax: 'USD,0',
          gross: 'USD,5550',
          preDiscount: 'USD,5550',
          total: 'USD,5550',
        },
      } as any,
    ],
  },
};
