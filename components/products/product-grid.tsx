'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/products/product-card'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useLanguage } from '@/lib/i18n/language-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductGridProps {
  categoryId?: string
  featured?: boolean
  limit?: number
}

export function ProductGrid({ categoryId, featured = false, limit = 12 }: ProductGridProps) {
  const { supabase } = useSupabase()
  const { t } = useLanguage()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  useEffect(() => {
    fetchProducts()
  }, [categoryId, featured, limit, searchQuery, currentPage])
  
  const fetchProducts = async () => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('products')
        .select('id, name, description, price, image_url, stock, category:category_id(name)', { count: 'exact' })
      
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
      
      // Pagination
      const from = (currentPage - 1) * limit
      const to = from + limit - 1
      
      const { data, count, error } = await query
        .order('name')
        .range(from, to)
      
      if (error) {
        console.error('Error fetching products:', error)
        return
      }
      
      setProducts(data || [])
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / limit))
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchProducts()
  }
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">Search</Button>
      </form>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('noProductsFound')}</p>
        </div>
      )}
    </div>
  )
}

