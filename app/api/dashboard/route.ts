import { NextRequest, NextResponse } from 'next/server';
import { KVClient } from '@/lib/kv-client';

export async function GET(request: NextRequest) {
  try {
    const data = await KVClient.getDashboardData();
    if (!data) {
      return NextResponse.json(
        { error: 'Dashboard data not found' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, status, currentTask, newInsight, metrics, message } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    const update = {
      agentId,
      status,
      currentTask,
      newInsight,
      metrics,
      message,
    };

    const updatedData = await KVClient.updateAgent(update);

    if (!updatedData) {
      return NextResponse.json(
        { error: 'Failed to update agent' },
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
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}