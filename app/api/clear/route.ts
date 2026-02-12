import { NextRequest, NextResponse } from 'next/server';
import { KVClient } from '@/lib/kv-client';

export async function POST(request: NextRequest) {
  try {
    await KVClient.clearAll();
    const data = await KVClient.getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error clearing dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to clear dashboard' },
      { status: 500 }
    );
  }
}