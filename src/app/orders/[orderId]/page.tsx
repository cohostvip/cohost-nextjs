import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OrderDetails } from '@/components/OrderDetails';
import { getOrder } from '@/lib/api';

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;

  try {
    const order = await getOrder(orderId);
    const eventTitle = order.meta?.resolvedContext?.title;

    return {
      title: `Order #${order.orderNumber} | Cohost`,
      description: eventTitle
        ? `Order confirmation for ${eventTitle}`
        : `Order confirmation #${order.orderNumber}`,
    };
  } catch {
    return {
      title: 'Order Not Found',
    };
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;

  const order = await getOrder(orderId).catch(() => null);
  if (!order) {
    notFound();
  }

  return <OrderDetails order={order} />;
}
