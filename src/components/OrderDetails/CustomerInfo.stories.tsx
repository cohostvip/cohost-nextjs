import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CustomerInfo } from './CustomerInfo';

const meta: Meta<typeof CustomerInfo> = {
  title: 'Orders/CustomerInfo',
  component: CustomerInfo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomerInfo>;

export const WithPhone: Story = {
  args: {
    customer: {
      name: 'Estelle Hobbs',
      email: 'ehob1358@icloud.com',
      phone: '+447549603676',
    } as any,
  },
};

export const WithoutPhone: Story = {
  args: {
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    } as any,
  },
};
