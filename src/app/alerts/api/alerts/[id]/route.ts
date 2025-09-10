import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET alert by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await db.alert.findUnique({
      where: { id: params.id },
      include: {
        product: true,
        batch: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}

// PUT update alert (resolve/dismiss)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACTIVE, RESOLVED, or DISMISSED' },
        { status: 400 }
      );
    }

    // Check if alert exists
    const existingAlert = await db.alert.findUnique({
      where: { id: params.id },
    });

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    // Update alert
    const updateData: any = { status };
    
    if (status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    }

    const alert = await db.alert.update({
      where: { id: params.id },
      data: updateData,
      include: {
        product: true,
        batch: true,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if alert exists
    const existingAlert = await db.alert.findUnique({
      where: { id: params.id },
    });

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    // Delete alert
    await db.alert.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}