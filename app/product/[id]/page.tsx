import { ProductDetails } from '@/components/product/product-details'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('id', params.id)
    .single()
  
  if (!product) {
    return {
      title: 'Product Not Found | KG-Components',
      description: 'The requested product could not be found.',
    }
  }
  
  return {
    title: `${product.name} | KG-Components`,
    description: product.description || `${product.name} - Electronic component from KG-Components.`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('id', params.id)
    .single()
  
  if (!product) {
    notFound()
  }
  
  // Get related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <div 
                className="h-full w-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${product.image_url})` }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </div>
        
        <div>
          <ProductDetails product={product} />
        </div>
      </div>
      
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted">
                  {relatedProduct.image_url ? (
                    <div 
                      className="h-full w-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${relatedProduct.image_url})` }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <div className="font-medium line-clamp-1">{relatedProduct.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {relatedProduct.category?.name}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="font-bold">${relatedProduct.price.toFixed(2)}</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/product/${relatedProduct.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

