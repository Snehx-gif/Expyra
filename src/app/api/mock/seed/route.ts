import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { mockProducts } from '@/lib/mock/seedData';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'seed') {
      // Clear existing data first to ensure a clean seed
      await prisma.salesPrediction.deleteMany();
      await prisma.alert.deleteMany();
      await prisma.inventory.deleteMany();
      await prisma.batch.deleteMany();
      await prisma.product.deleteMany();
      await prisma.supplier.deleteMany();

      // Seed Suppliers (if you have mock suppliers, otherwise create dummy ones)
      const mockSuppliers = [
        { id: 'supplier1', name: 'Fresh Farms Inc.', email: 'contact@freshfarms.com', phone: '123-456-7890', address: '123 Farm Rd' },
        { id: 'supplier2', name: 'Dairy Best', email: 'info@dairybest.com', phone: '098-765-4321', address: '456 Dairy Ln' },
      ];

      for (const supplier of mockSuppliers) {
        await prisma.supplier.create({
          data: supplier,
        });
      }

      // Seed Products
      for (const product of mockProducts) {
        await prisma.product.create({
          data: {
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            sku: product.sku,
            barcode: product.barcode,
            image: product.image,
            supplierId: product.supplierId,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
          },
        });

        // Seed Batches for each product
        if (product.batches) {
          for (const batch of product.batches) {
            await prisma.batch.create({
              data: {
                id: batch.id,
                batchId: batch.batchId,
                manufacturingDate: new Date(batch.manufacturingDate),
                expiryDate: new Date(batch.expiryDate),
                initialQuantity: batch.currentQuantity,
                currentQuantity: batch.currentQuantity,
                productId: product.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }
      }

      return NextResponse.json({ success: true, message: 'Database seeded successfully!' }, { status: 200 });

    } else if (action === 'clear') {
      // Clear data in reverse order of dependency
      await prisma.salesPrediction.deleteMany();
      await prisma.alert.deleteMany();
      await prisma.inventory.deleteMany();
      await prisma.batch.deleteMany();
      await prisma.product.deleteMany();
      await prisma.supplier.deleteMany();

      return NextResponse.json({ success: true, message: 'Database cleared successfully!' }, { status: 200 });

    } else {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in mock data API:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
