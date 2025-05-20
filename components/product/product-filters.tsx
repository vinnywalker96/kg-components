'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

interface ProductFiltersProps {
  categories: any[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')
  
  useEffect(() => {
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)])
    }
  }, [minPrice, maxPrice])
  
  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (params.get('category') === categoryName) {
      params.delete('category')
    } else {
      params.set('category', categoryName)
    }
    
    router.push(`/account?${params.toString()}`)
  }
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }
  
  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (priceRange[0] > 0) {
      params.set('min_price', priceRange[0].toString())
    } else {
      params.delete('min_price')
    }
    
    if (priceRange[1] < 1000) {
      params.set('max_price', priceRange[1].toString())
    } else {
      params.delete('max_price')
    }
    
    router.push(`/account?${params.toString()}`)
  }
  
  const clearAllFilters = () => {
    router.push('/account')
    setPriceRange([0, 1000])
    setMinPrice('')
    setMaxPrice('')
  }
  
  const hasActiveFilters = searchParams.toString() !== ''
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                searchParams.get('category') === category.name
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-6">
          <Slider
            defaultValue={[0, 1000]}
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={handlePriceChange}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="min-price" className="text-sm text-muted-foreground">
                Min
              </label>
              <Input
                id="min-price"
                type="number"
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (!isNaN(value) && value >= 0 && value <= priceRange[1]) {
                    setPriceRange([value, priceRange[1]])
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="max-price" className="text-sm text-muted-foreground">
                Max
              </label>
              <Input
                id="max-price"
                type="number"
                min={priceRange[0]}
                max={1000}
                value={priceRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (!isNaN(value) && value >= priceRange[0] && value <= 1000) {
                    setPriceRange([priceRange[0], value])
                  }
                }}
              />
            </div>
          </div>
          
          <Button onClick={applyPriceFilter} className="w-full">
            Apply Price Filter
          </Button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="pt-4">
          <Button variant="outline" onClick={clearAllFilters} className="w-full">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

