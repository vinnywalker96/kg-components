'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { ProductCard } from '@/components/products/product-card'
import { useLanguage } from '@/lib/i18n/language-context'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductGridProps {
  categoryId?: string
  featured?: boolean
  limit?: number
  searchQuery?: string
  className?: string
}

export function ProductGrid({ 
  categoryId, 
  featured = false, 
  limit = 12,
  searchQuery = '',
  className = ''
}: ProductGridProps) {
  const { supabase } = useSupabase()
  const { t } = useLanguage()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            categories:categories(name)
          `)
          .order('name')
        
        // Apply filters
        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }
        
        if (featured) {
          query = query.eq('featured', true)
        }
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`)
        }
        
        // Apply limit
        if (limit > 0) {
          query = query.limit(limit)
        }
        
        const { data, error } = await query
        
        if (error) {
          throw error
        }
        
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [supabase, categoryId, featured, limit, searchQuery])
  
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('noProductsFound')}</p>
      </div>
    )
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description || ''}
          price={product.price}
          image={product.image_url || '/images/product-placeholder.png'}
          category={product.categories?.name}
          inStock={product.stock > 0}
        />
      ))}
    </div>
  )
}

