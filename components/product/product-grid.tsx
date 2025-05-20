'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Grid, List } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ProductGridProps {
  products: any[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    
    router.push(`/account?${params.toString()}`)
  }
  
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    
    router.push(`/account?${params.toString()}`)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-2">
          <Select
            defaultValue={searchParams.get('sort') || 'name_asc'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="price_asc">Price (Low to High)</SelectItem>
              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <button
              type="button"
              className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </button>
            <button
              type="button"
              className={`p-2 ${viewMode === 'list' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </button>
          </div>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              router.push('/account')
              setSearchTerm('')
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="h-48 bg-muted">
                {product.image_url ? (
                  <div 
                    className="h-full w-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${product.image_url})` }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <div className="font-medium line-clamp-1">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.category?.name}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="font-bold">${product.price.toFixed(2)}</div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/product/${product.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 bg-muted flex-shrink-0">
                  {product.image_url ? (
                    <div 
                      className="h-full w-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 flex-grow">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="font-medium text-lg mb-1">{product.name}</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        {product.category?.name}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {product.description || 'No description available.'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
                      <Button variant="outline" asChild>
                        <Link href={`/product/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

