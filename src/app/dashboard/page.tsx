
'use client';

import { useEffect, useState } from 'react';
import { Product, Batch } from '@prisma/client';

interface ProductWithBatches extends Product {
  batches: Batch[];
}

export default function DashboardPage() {
  const [products, setProducts] = useState<ProductWithBatches[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Product Inventory</h1>
      <div className="space-y-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{product.category}</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Total Stock</p>
                <p className="text-3xl font-bold">{product.batches.reduce((acc, batch) => acc + batch.currentQuantity, 0)}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Batches</h3>
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Batch ID</th>
                    <th className="py-2 px-4 border-b text-left">Manufacturing Date</th>
                    <th className="py-2 px-4 border-b text-left">Expiry Date</th>
                    <th className="py-2 px-4 border-b text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {product.batches.map(batch => (
                    <tr key={batch.id}>
                      <td className="py-2 px-4 border-b">{batch.batchId}</td>
                      <td className="py-2 px-4 border-b">{new Date(batch.manufacturingDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{new Date(batch.expiryDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b text-right">{batch.currentQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
