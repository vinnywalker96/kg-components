import { ProductGrid } from "@/components/shop/product-grid"
import { ShopFilters } from "@/components/shop/shop-filters"
import { ShopHeader } from "@/components/shop/shop-header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop | KG-Components",
  description: "Browse our wide selection of electronic components, tools, and test equipment.",
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryParam = searchParams.category as string | undefined
  const searchQuery = searchParams.search as string | undefined

  return (
    <div className="container mx-auto px-4 py-12">
      <ShopHeader 
        title="Shop Electronic Components"
        description="Browse our wide selection of electronic components, tools, and test equipment."
        initialSearchQuery={searchQuery}
      />
      
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <ShopFilters initialCategory={categoryParam} />
        </aside>
        
        <div className="flex-grow">
          <ProductGrid 
            initialCategory={categoryParam} 
            initialSearchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  )
}

