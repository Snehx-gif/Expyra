import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for product validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  image: z.string().optional(),
  supplierId: z.string().optional(),
});

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          supplier: true,
          batches: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              batches: true,
              alerts: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check if SKU already exists
    if (validatedData.sku) {
      const existingProduct = await db.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Create product
    const product = await db.product.create({
      data: validatedData,
      include: {
        supplier: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}