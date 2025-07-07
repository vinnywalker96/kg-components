import { Metadata } from 'next'
import { ProductGrid } from '@/components/products/product-grid'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Electronic Tools & Components | KG-Components',
  description: 'Browse our selection of electronic tools and components for your projects.',
}

export default async function ToolsPage() {
  const supabase = createClient()
  
  // Fetch categories for the sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')
  
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Electronic Tools & Components</h1>
          <p className="text-muted-foreground">
            Browse our selection of high-quality electronic components and tools for your projects.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <a 
                        href={`/category/${category.id}`}
                        className="text-sm hover:underline"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <ProductGrid featured={true} limit={8} />
            
            <h2 className="text-2xl font-bold mt-12 mb-6">All Products</h2>
            <ProductGrid limit={12} />
          </div>
        </div>
      </div>
    </div>
  )
}

