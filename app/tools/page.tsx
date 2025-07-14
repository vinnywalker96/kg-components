import { Metadata } from 'next'
import { ProductGrid } from '@/components/products/product-grid'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Electronic Components | KG-Components',
  description: 'Browse our selection of high-quality electronic components for your projects.',
}

export default async function ToolsPage() {
  const supabase = createClient()
  
  // Fetch all categories for the sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')
  
  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, category_id, categories(name)')
    .eq('featured', true)
    .limit(4)
  
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Electronic Components</h1>
        
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
            {featuredProducts && featuredProducts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <a href={`/product/${product.id}`}>
                        <div className="aspect-square relative">
                          <img
                            src={product.image_url || '/images/product-placeholder.png'}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground">
                              {product.categories?.name}
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <h2 className="text-2xl font-bold mb-6">All Products</h2>
            <ProductGrid />
          </div>
        </div>
      </div>
    </div>
  )
}

