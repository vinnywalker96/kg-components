import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/products/product-grid'
import { createClient } from '@/lib/supabase/server'

interface CategoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const supabase = createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('id', params.id)
    .single()
  
  if (!category) {
    return {
      title: 'Category Not Found | KG-Components',
      description: 'The requested category could not be found.',
    }
  }
  
  return {
    title: `${category.name} | KG-Components`,
    description: category.description || `Browse our selection of ${category.name.toLowerCase()} products.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient()
  
  // Fetch category details
  const { data: category, error } = await supabase
    .from('categories')
    .select('id, name, description')
    .eq('id', params.id)
    .single()
  
  if (error || !category) {
    notFound()
  }
  
  // Fetch all categories for the sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')
  
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories?.map((cat) => (
                    <li key={cat.id}>
                      <a 
                        href={`/category/${cat.id}`}
                        className={`text-sm hover:underline ${
                          cat.id === category.id ? 'font-bold' : ''
                        }`}
                      >
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-6">{category.name} Products</h2>
            <ProductGrid categoryId={category.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

