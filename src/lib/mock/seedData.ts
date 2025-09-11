
export const mockProducts = [
  {
    id: '1',
    name: 'Organic Bananas',
    description: 'A bunch of fresh, organic bananas.',
    category: 'Produce',
    sku: 'PROD-BNN-001',
    barcode: '1234567890123',
    image: '/images/bananas.jpg',
    supplierId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supplier: {
      id: '1',
      name: 'Fresh Farms Inc.',
    },
    batches: [
      {
        id: '1',
        batchId: 'B-001',
        manufacturingDate: '2025-08-01',
        expiryDate: '2025-09-15',
        currentQuantity: 100,
      },
      {
        id: '2',
        batchId: 'B-002',
        manufacturingDate: '2025-08-15',
        expiryDate: '2025-09-30',
        currentQuantity: 50,
      },
    ],
    _count: {
      batches: 2,
      alerts: 1,
    },
  },
  {
    id: '2',
    name: 'Whole Milk',
    description: 'A gallon of fresh, whole milk.',
    category: 'Dairy',
    sku: 'DAIRY-MLK-001',
    barcode: '1234567890124',
    image: '/images/milk.jpg',
    supplierId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supplier: {
      id: '2',
      name: 'Dairy Best',
    },
    batches: [
      {
        id: '3',
        batchId: 'B-003',
        manufacturingDate: '2025-09-01',
        expiryDate: '2025-09-25',
        currentQuantity: 75,
      },
    ],
    _count: {
      batches: 1,
      alerts: 0,
    },
  },
];
