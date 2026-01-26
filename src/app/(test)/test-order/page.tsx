import { OrderDetails } from '@/components/OrderDetails';
import orderWithGroup from '../../../../__mocks__/order-artifact-1.json';

export const metadata = {
  title: 'Test Order | Cohost',
};

/**
 * Test page that renders OrderDetails with mock data.
 * Protected by (test)/layout.tsx - only available in development/test.
 * Access at: /test-order
 */
export default function TestOrderPage() {
  return <OrderDetails order={orderWithGroup as any} />;
}
