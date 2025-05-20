'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Edit, Trash2, Search } from 'lucide-react'

interface ProductsTableProps {
  products: any[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
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
                <th className="text-left font-medium py-3 px-4">Product</th>
                <th className="text-left font-medium py-3 px-4">Category</th>
                <th className="text-left font-medium py-3 px-4">SKU</th>
                <th className="text-right font-medium py-3 px-4">Price</th>
                <th className="text-right font-medium py-3 px-4">Stock</th>
                <th className="text-right font-medium py-3 px-4">Created</th>
                <th className="text-right font-medium py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-muted rounded flex-shrink-0 mr-3">
                          {product.image_url ? (
                            <div 
                              className="h-full w-full bg-cover bg-center rounded" 
                              style={{ backgroundImage: `url(${product.image_url})` }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3 px-4">
                      {product.sku || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.stock_quantity}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${product.id}`}>
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

