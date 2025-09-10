import { db } from '@/lib/db';

// Mock data for seeding the database
export const mockSuppliers = [
  {
    id: 'supplier_1',
    name: 'Fresh Dairy Co.',
    email: 'contact@freshdairy.com',
    phone: '+1-555-0123',
    address: '123 Dairy Lane, Milk City, MC 12345',
  },
  {
    id: 'supplier_2',
    name: 'Artisan Bakery Ltd.',
    email: 'orders@artisanbakery.com',
    phone: '+1-555-0456',
    address: '456 Bread Street, Bakery Town, BT 67890',
  },
  {
    id: 'supplier_3',
    name: 'Premium Meats Inc.',
    email: 'sales@premiummeats.com',
    phone: '+1-555-0789',
    address: '789 Meat Avenue, Butcher City, BC 101112',
  },
  {
    id: 'supplier_4',
    name: 'Green Produce Farms',
    email: 'hello@greenproduce.com',
    phone: '+1-555-0321',
    address: '321 Farm Road, Agricultural Valley, AV 131415',
  },
];

export const mockProducts = [
  {
    id: 'product_1',
    name: 'Whole Milk 2L',
    description: 'Fresh whole milk from grass-fed cows',
    category: 'Dairy',
    sku: 'DAIRY-001',
    barcode: '1234567890123',
    supplierId: 'supplier_1',
  },
  {
    id: 'product_2',
    name: 'Sourdough Bread',
    description: 'Artisanal sourdough bread loaf',
    category: 'Bakery',
    sku: 'BAKERY-001',
    barcode: '1234567890124',
    supplierId: 'supplier_2',
  },
  {
    id: 'product_3',
    name: 'Chicken Breast',
    description: 'Fresh boneless chicken breast',
    category: 'Meat & Poultry',
    sku: 'MEAT-001',
    barcode: '1234567890125',
    supplierId: 'supplier_3',
  },
  {
    id: 'product_4',
    name: 'Organic Apples',
    description: 'Fresh organic red apples',
    category: 'Produce',
    sku: 'PRODUCE-001',
    barcode: '1234567890126',
    supplierId: 'supplier_4',
  },
  {
    id: 'product_5',
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt',
    category: 'Dairy',
    sku: 'DAIRY-002',
    barcode: '1234567890127',
    supplierId: 'supplier_1',
  },
  {
    id: 'product_6',
    name: 'Whole Wheat Bread',
    description: 'Healthy whole wheat bread loaf',
    category: 'Bakery',
    sku: 'BAKERY-002',
    barcode: '1234567890128',
    supplierId: 'supplier_2',
  },
  {
    id: 'product_7',
    name: 'Ground Beef',
    description: 'Fresh ground beef 80/20',
    category: 'Meat & Poultry',
    sku: 'MEAT-002',
    barcode: '1234567890129',
    supplierId: 'supplier_3',
  },
  {
    id: 'product_8',
    name: 'Bananas',
    description: 'Fresh yellow bananas',
    category: 'Produce',
    sku: 'PRODUCE-002',
    barcode: '1234567890130',
    supplierId: 'supplier_4',
  },
];

export const mockBatches = [
  {
    id: 'batch_1',
    batchId: 'MILK-2024-001',
    manufacturingDate: new Date('2024-01-01'),
    expiryDate: new Date('2024-01-15'),
    initialQuantity: 100,
    currentQuantity: 85,
    productId: 'product_1',
  },
  {
    id: 'batch_2',
    batchId: 'BREAD-2024-001',
    manufacturingDate: new Date('2024-01-02'),
    expiryDate: new Date('2024-01-08'),
    initialQuantity: 50,
    currentQuantity: 35,
    productId: 'product_2',
  },
  {
    id: 'batch_3',
    batchId: 'CHICKEN-2024-001',
    manufacturingDate: new Date('2024-01-03'),
    expiryDate: new Date('2024-01-10'),
    initialQuantity: 75,
    currentQuantity: 60,
    productId: 'product_3',
  },
  {
    id: 'batch_4',
    batchId: 'APPLES-2024-001',
    manufacturingDate: new Date('2024-01-04'),
    expiryDate: new Date('2024-01-20'),
    initialQuantity: 200,
    currentQuantity: 180,
    productId: 'product_4',
  },
  {
    id: 'batch_5',
    batchId: 'YOGURT-2024-001',
    manufacturingDate: new Date('2024-01-05'),
    expiryDate: new Date('2024-01-25'),
    initialQuantity: 60,
    currentQuantity: 55,
    productId: 'product_5',
  },
  // Add some near-expiry batches
  {
    id: 'batch_6',
    batchId: 'MILK-2024-002',
    manufacturingDate: new Date('2024-01-10'),
    expiryDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    initialQuantity: 80,
    currentQuantity: 65,
    productId: 'product_1',
  },
  {
    id: 'batch_7',
    batchId: 'BREAD-2024-002',
    manufacturingDate: new Date('2024-01-11'),
    expiryDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    initialQuantity: 40,
    currentQuantity: 25,
    productId: 'product_2',
  },
  // Add some expired batches
  {
    id: 'batch_8',
    batchId: 'CHICKEN-2024-002',
    manufacturingDate: new Date('2024-01-01'),
    expiryDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    initialQuantity: 30,
    currentQuantity: 15,
    productId: 'product_3',
  },
];

export const mockInventory = [
  {
    id: 'inventory_1',
    quantity: 85,
    location: 'A1-01',
    batchId: 'batch_1',
    productId: 'product_1',
  },
  {
    id: 'inventory_2',
    quantity: 35,
    location: 'B2-01',
    batchId: 'batch_2',
    productId: 'product_2',
  },
  {
    id: 'inventory_3',
    quantity: 60,
    location: 'C1-01',
    batchId: 'batch_3',
    productId: 'product_3',
  },
  {
    id: 'inventory_4',
    quantity: 180,
    location: 'D1-01',
    batchId: 'batch_4',
    productId: 'product_4',
  },
  {
    id: 'inventory_5',
    quantity: 55,
    location: 'A1-02',
    batchId: 'batch_5',
    productId: 'product_5',
  },
  {
    id: 'inventory_6',
    quantity: 65,
    location: 'A1-03',
    batchId: 'batch_6',
    productId: 'product_1',
  },
  {
    id: 'inventory_7',
    quantity: 25,
    location: 'B2-02',
    batchId: 'batch_7',
    productId: 'product_2',
  },
  {
    id: 'inventory_8',
    quantity: 15,
    location: 'C1-02',
    batchId: 'batch_8',
    productId: 'product_3',
  },
];

export const mockAlerts = [
  {
    id: 'alert_1',
    type: 'NEAR_EXPIRY' as const,
    title: 'Milk Batch #MILK-2024-002 expiring soon',
    message: 'Whole Milk 2L batch expiring in 2 days. Consider applying discount.',
    status: 'ACTIVE' as const,
    productId: 'product_1',
    batchId: 'batch_6',
  },
  {
    id: 'alert_2',
    type: 'NEAR_EXPIRY' as const,
    title: 'Bread Batch #BREAD-2024-002 expiring soon',
    message: 'Sourdough Bread batch expiring in 1 day. Immediate action required.',
    status: 'ACTIVE' as const,
    productId: 'product_2',
    batchId: 'batch_7',
  },
  {
    id: 'alert_3',
    type: 'EXPIRED' as const,
    title: 'Chicken Batch #CHICKEN-2024-002 has expired',
    message: 'Ground Beef batch expired 1 day ago. Remove from inventory immediately.',
    status: 'ACTIVE' as const,
    productId: 'product_3',
    batchId: 'batch_8',
  },
  {
    id: 'alert_4',
    type: 'DONATION_READY' as const,
    title: 'Bread ready for donation',
    message: 'Sourdough Bread batch nearing expiry. Contact local food bank.',
    status: 'ACTIVE' as const,
    productId: 'product_2',
    batchId: 'batch_7',
  },
  {
    id: 'alert_5',
    type: 'LOW_STOCK' as const,
    title: 'Low stock on Greek Yogurt',
    message: 'Greek Yogurt inventory running low. Consider reordering.',
    status: 'ACTIVE' as const,
    productId: 'product_5',
  },
];

export const mockSalesPredictions = [
  {
    id: 'prediction_1',
    productId: 'product_1',
    predictedDate: new Date('2024-01-15'),
    predictedSales: 120,
    confidence: 0.92,
    factors: JSON.stringify({ seasonality: 1.1, trend: 1.05, external: 1.0 }),
  },
  {
    id: 'prediction_2',
    productId: 'product_2',
    predictedDate: new Date('2024-01-15'),
    predictedSales: 85,
    confidence: 0.88,
    factors: JSON.stringify({ seasonality: 1.0, trend: 1.02, external: 1.0 }),
  },
  {
    id: 'prediction_3',
    productId: 'product_3',
    predictedDate: new Date('2024-01-15'),
    predictedSales: 65,
    confidence: 0.85,
    factors: JSON.stringify({ seasonality: 0.95, trend: 1.08, external: 1.0 }),
  },
  {
    id: 'prediction_4',
    productId: 'product_4',
    predictedDate: new Date('2024-01-15'),
    predictedSales: 150,
    confidence: 0.90,
    factors: JSON.stringify({ seasonality: 1.2, trend: 1.03, external: 1.0 }),
  },
];

// Main seeding function
export async function seedMockData() {
  try {
    console.log('Seeding mock data...');

    // Clear existing data (optional)
    // await db.alert.deleteMany();
    // await db.salesPrediction.deleteMany();
    // await db.inventory.deleteMany();
    // await db.batch.deleteMany();
    // await db.product.deleteMany();
    // await db.supplier.deleteMany();

    // Seed suppliers
    for (const supplier of mockSuppliers) {
      await db.supplier.upsert({
        where: { id: supplier.id },
        update: supplier,
        create: supplier,
      });
    }

    // Seed products
    for (const product of mockProducts) {
      await db.product.upsert({
        where: { id: product.id },
        update: product,
        create: product,
      });
    }

    // Seed batches
    for (const batch of mockBatches) {
      await db.batch.upsert({
        where: { id: batch.id },
        update: batch,
        create: batch,
      });
    }

    // Seed inventory
    for (const inventory of mockInventory) {
      await db.inventory.upsert({
        where: { id: inventory.id },
        update: inventory,
        create: inventory,
      });
    }

    // Seed alerts
    for (const alert of mockAlerts) {
      await db.alert.upsert({
        where: { id: alert.id },
        update: alert,
        create: alert,
      });
    }

    // Seed sales predictions
    for (const prediction of mockSalesPredictions) {
      await db.salesPrediction.upsert({
        where: { id: prediction.id },
        update: prediction,
        create: prediction,
      });
    }

    console.log('Mock data seeded successfully!');
    return { success: true, message: 'Mock data seeded successfully' };
  } catch (error) {
    console.error('Error seeding mock data:', error);
    return { success: false, message: 'Failed to seed mock data', error };
  }
}

// Function to clear all mock data
export async function clearMockData() {
  try {
    console.log('Clearing mock data...');
    
    await db.alert.deleteMany();
    await db.salesPrediction.deleteMany();
    await db.inventory.deleteMany();
    await db.batch.deleteMany();
    await db.product.deleteMany();
    await db.supplier.deleteMany();

    console.log('Mock data cleared successfully!');
    return { success: true, message: 'Mock data cleared successfully' };
  } catch (error) {
    console.error('Error clearing mock data:', error);
    return { success: false, message: 'Failed to clear mock data', error };
  }
}