import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OrderDetails } from '@/components/OrderDetails';
import { getOrder } from '@/lib/api';

interface OrderPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

/**
 * Parse the order slug to extract uid and orderId
 * Format: {uid}_{orderId}
 */
function parseOrderSlug(slug: string): { uid: string; orderId: string } | null {
  const parts = slug.split('_');
  if (parts.length !== 2) {
    return null;
  }
  return {
    uid: parts[0],
    orderId: parts[1],
  };
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseOrderSlug(slug);

  if (!parsed) {
    return { title: 'Invalid Order Link' };
  }

  try {
    const order = await getOrder(parsed.orderId);
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

export default async function ChannelOrderPage({ params }: OrderPageProps) {
  const { slug } = await params;
  const parsed = parseOrderSlug(slug);

  if (!parsed) {
    notFound();
  }

  const order = await getOrder(parsed.orderId).catch(() => null);
  if (!order) {
    notFound();
  }

  // Verify the uid matches for security (optional but recommended)
  if (order.uid !== parsed.uid) {
    notFound();
  }

  return <OrderDetails order={order} />;
}
