import { NextRequest, NextResponse } from 'next/server';
import { seedMockData, clearMockData } from '@/lib/mock/seedData';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'seed';

    let result;

    if (action === 'seed') {
      result = await seedMockData();
    } else if (action === 'clear') {
      result = await clearMockData();
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "seed" or "clear"' },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.message, details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in mock data API:', error);
    return NextResponse.json(
      { error: 'Failed to process mock data request' },
      { status: 500 }
    );
  }
}