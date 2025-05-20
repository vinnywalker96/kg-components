'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Edit, Trash2, Search } from 'lucide-react'

interface CategoriesTableProps {
  categories: any[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium py-3 px-4">Name</th>
                <th className="text-left font-medium py-3 px-4">Description</th>
                <th className="text-right font-medium py-3 px-4">Products</th>
                <th className="text-right font-medium py-3 px-4">Created</th>
                <th className="text-right font-medium py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="font-medium">{category.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      {category.description || 'No description'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {category.product_count}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/categories/${category.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

