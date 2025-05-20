import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/admin/products/products-table'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Products | Admin Dashboard',
  description: 'Add, edit, and manage products in your store.',
}

export default async function AdminProductsPage() {
  const supabase = createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      <ProductsTable products={products || []} />
    </div>
  )
}

