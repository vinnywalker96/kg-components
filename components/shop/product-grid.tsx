"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/integrations/supabase/client"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category_id: string
  stock: number
  category: {
    name: string
  }
}

interface ProductGridProps {
  initialCategory?: string
  initialSearchQuery?: string
}

export function ProductGrid({ initialCategory, initialSearchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(initialCategory || "")
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "")

  useEffect(() => {
    fetchProducts()
  }, [category, searchQuery])

  useEffect(() => {
    setCategory(initialCategory || "")
  }, [initialCategory])

  useEffect(() => {
    setSearchQuery(initialSearchQuery || "")
  }, [initialSearchQuery])

  async function fetchProducts() {
    try {
      setLoading(true)
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
      
      // Apply category filter
      if (category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category)
          .single()
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        }
      }
      
      // Apply search filter
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching products:', error)
        return
      }
      
      setProducts(data as Product[])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden flex flex-col h-full">
          <div className="aspect-square bg-muted relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}
            <Badge className="absolute top-2 right-2">
              {product.category?.name}
            </Badge>
          </div>
          <CardContent className="p-4 flex flex-col flex-grow">
            <Link href={`/product/${product.id}`} className="hover:underline">
              <h3 className="font-medium line-clamp-1">{product.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-2">
              {product.description}
            </p>
            <div className="mt-auto">
              <div className="font-bold mb-2">${product.price.toFixed(2)}</div>
              <Button className="w-full" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

