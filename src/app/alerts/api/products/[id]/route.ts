import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for product update validation
const productUpdateSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  image: z.string().optional(),
  supplierId: z.string().optional(),
});

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        supplier: true,
        batches: {
          include: {
            inventory: true,
            alerts: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        predictions: {
          orderBy: { predictedDate: 'desc' },
          take: 5,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = productUpdateSchema.parse(body);

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if SKU already exists (if updating SKU)
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const skuExists = await db.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (skuExists) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Update product
    const product = await db.product.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        supplier: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product (this will cascade delete related records due to Prisma relations)
    await db.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}