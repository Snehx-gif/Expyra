
'use client'
import Link from 'next/link';
import { ProductForm } from '@/components/product-form'
import { WebsocketProvider } from '@/components/websocket-provider'

export default function Home() {
  return (
    <WebsocketProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Link href="/dashboard">
          <a className="text-blue-500 hover:underline">Go to Dashboard</a>
        </Link>
        <ProductForm />
      </main>
    </WebsocketProvider>
  )
}
