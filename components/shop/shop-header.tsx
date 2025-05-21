"use client"

import { useState, FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

interface ShopHeaderProps {
  title: string
  description: string
  initialSearchQuery?: string
}

export function ShopHeader({ 
  title, 
  description, 
  initialSearchQuery = "" 
}: ShopHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full max-w-lg space-x-2">
        <Input
          type="search"
          placeholder="Search products..."
          className="flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  )
}

