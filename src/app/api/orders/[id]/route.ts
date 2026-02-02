import { NextRequest, NextResponse } from 'next/server';
import { cohostClient } from '@/lib/api';
import type { Order } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const uid = request.nextUrl.searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'uid is required' }, { status: 400 });
  }

  try {
    const response = await cohostClient.orders.fetch(id, uid) as unknown as { order: Order };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}
