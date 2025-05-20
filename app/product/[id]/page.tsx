import { ProductDetails } from "@/components/product/product-details"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductRecommendations } from "@/components/product/product-recommendations"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = createClient()
  
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", params.id)
    .single()
  
  if (!product) {
    return {
      title: "Product Not Found | KG-Components",
      description: "The requested product could not be found.",
    }
  }
  
  return {
    title: `${product.name} | KG-Components`,
    description: product.description || "View product details and specifications.",
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient()
  
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", params.id)
    .single()
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <ProductGallery product={product} />
        <ProductDetails product={product} />
      </div>
      
      <ProductRecommendations categoryId={product.category_id} currentProductId={product.id} />
    </div>
  )
}

