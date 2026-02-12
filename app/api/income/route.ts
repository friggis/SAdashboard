import { NextRequest, NextResponse } from 'next/server';
import { KVClient } from '@/lib/kv-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, amount, breakdownKey } = body;

    if (!agentId || amount === undefined) {
      return NextResponse.json(
        { error: 'agentId and amount are required' },
        { status: 400 }
      );
    }

    const updatedData = await KVClient.updateIncome(agentId, amount, breakdownKey);

    if (!updatedData) {
      return NextResponse.json(
        { error: 'Failed to update income' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json(
      { error: 'Failed to update income' },
      { status: 500 }
    );
  }
}