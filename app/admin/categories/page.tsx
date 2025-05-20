import { Button } from '@/components/ui/button'
import { CategoriesTable } from '@/components/admin/categories/categories-table'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Categories | Admin Dashboard',
  description: 'Add, edit, and manage product categories in your store.',
}

export default async function AdminCategoriesPage() {
  const supabase = createClient()
  
  // Get categories with product count
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .order('name', { ascending: true })
  
  // Transform data to include product count
  const categoriesWithCount = categories?.map(category => ({
    ...category,
    product_count: category.products.length
  })) || []
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>
      
      <CategoriesTable categories={categoriesWithCount} />
    </div>
  )
}

