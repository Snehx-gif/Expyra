import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for alert validation
const alertSchema = z.object({
  type: z.enum(['NEAR_EXPIRY', 'DONATION_READY', 'EXPIRED', 'LOW_STOCK']),
  title: z.string().min(1, 'Alert title is required'),
  message: z.string().min(1, 'Alert message is required'),
  productId: z.string().optional(),
  batchId: z.string().optional(),
});

// GET all alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || 'ACTIVE';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { status };
    
    if (type) {
      where.type = type;
    }

    // Get alerts with pagination
    const [alerts, total] = await Promise.all([
      db.alert.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              sku: true,
            },
          },
          batch: {
            select: {
              id: true,
              batchId: true,
              expiryDate: true,
              currentQuantity: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.alert.count({ where }),
    ]);

    return NextResponse.json({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST create new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = alertSchema.parse(body);

    // Create alert
    const alert = await db.alert.create({
      data: validatedData,
      include: {
        product: true,
        batch: true,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}