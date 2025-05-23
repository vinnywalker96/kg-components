"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
}

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("min_price") || "0"),
    parseInt(searchParams.get("max_price") || "1000")
  ])

  function handleCategoryChange(category: string) {
    if (selectedCategory === category) {
      setSelectedCategory("")
    } else {
      setSelectedCategory(category)
    }
  }

  function handlePriceChange(value: number[]) {
    setPriceRange([value[0], value[1]])
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedCategory) {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    
    params.set("min_price", priceRange[0].toString())
    params.set("max_price", priceRange[1].toString())
    
    router.push(`${pathname}?${params.toString()}`)
  }

  function resetFilters() {
    setSelectedCategory("")
    setPriceRange([0, 1000])
    router.push(pathname)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`} 
                  checked={selectedCategory === category.name}
                  onCheckedChange={() => handleCategoryChange(category.name)}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Price Range</h3>
            <span className="text-sm">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            className="my-6"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
}

