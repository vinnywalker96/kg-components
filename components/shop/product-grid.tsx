"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cartStore"
import { useProductStore } from "@/lib/store/productStore"
import { formatCurrency } from "@/lib/utils"

interface ProductGridProps {
  initialFilters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    sort?: string
  }
}

export function ProductGrid({ initialFilters = {} }: ProductGridProps) {
  const { products, isLoading, fetchProducts } = useProductStore()
  const { addToCart } = useCartStore()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [filters, setFilters] = useState(initialFilters)
  
  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])
  
  useEffect(() => {
    fetchProducts(filters)
  }, [filters, fetchProducts])
  
  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id)
    
    try {
      addToCart(product, 1)
      
      // Show toast notification
      // toast({
      //   title: "Added to cart",
      //   description: `${product.name} has been added to your cart.`,
      //   type: "success",
      // })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(null)
    }
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-6 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-1/3" />
            </CardFooter>
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
          Try adjusting your filters or search criteria.
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden flex flex-col h-full">
          <Link href={`/product/${product.id}`} className="aspect-square bg-muted relative">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </Link>
          <CardContent className="p-4 flex-grow">
            <Link href={`/product/${product.id}`} className="hover:underline">
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <div className="text-sm text-muted-foreground mb-2">
              {product.category?.name}
            </div>
            <p className="text-sm line-clamp-2 text-muted-foreground">
              {product.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="font-bold">{formatCurrency(product.price)}</div>
            <Button
              size="sm"
              onClick={() => handleAddToCart(product)}
              disabled={addingToCart === product.id}
            >
              {addingToCart === product.id ? "Adding..." : "Add to Cart"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

