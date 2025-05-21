import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop | KG-Components",
  description: "Browse our wide selection of electronic components, tools, and test equipment.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  
  // Get all categories for the filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })
  
  // Build the query for products
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
  
  // Apply category filter
  if (searchParams.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', searchParams.category)
      .single()
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id)
    }
  }
  
  // Apply price filters
  if (searchParams.min_price) {
    query = query.gte('price', parseFloat(searchParams.min_price as string))
  }
  
  if (searchParams.max_price) {
    query = query.lte('price', parseFloat(searchParams.max_price as string))
  }
  
  // Apply search filter
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }
  
  // Apply sorting
  if (searchParams.sort) {
    const [field, order] = (searchParams.sort as string).split('_')
    query = query.order(field, { ascending: order === 'asc' })
  } else {
    query = query.order('name', { ascending: true })
  }
  
  const { data: products } = await query
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">
          Browse our selection of electronic components.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="lg:col-span-1">
          <ProductFilters categories={categories || []} />
        </div>
        
        <div className="lg:col-span-3">
          <ProductGrid products={products || []} />
        </div>
      </div>
    </div>
  )
}

