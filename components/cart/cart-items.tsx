'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface CartItemsProps {
  items: any[]
}

export function CartItems({ items }: CartItemsProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    
    setLoading(prev => ({ ...prev, [itemId]: true }))
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
      
      if (error) throw error
      
      router.refresh()
    } catch (error) {
      console.error('Error updating cart item:', error)
    } finally {
      setLoading(prev => ({ ...prev, [itemId]: false }))
    }
  }
  
  const removeItem = async (itemId: string) => {
    setLoading(prev => ({ ...prev, [itemId]: true }))
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
      
      if (error) throw error
      
      router.refresh()
    } catch (error) {
      console.error('Error removing cart item:', error)
    } finally {
      setLoading(prev => ({ ...prev, [itemId]: false }))
    }
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">
          Add items to your cart to see them here.
        </p>
        <Button asChild>
          <Link href="/account">
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left font-medium py-3 px-4">Product</th>
              <th className="text-center font-medium py-3 px-4">Quantity</th>
              <th className="text-right font-medium py-3 px-4">Price</th>
              <th className="text-right font-medium py-3 px-4">Total</th>
              <th className="text-right font-medium py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-muted rounded flex-shrink-0 mr-4">
                      {item.product.image_url ? (
                        <div 
                          className="h-full w-full bg-cover bg-center rounded" 
                          style={{ backgroundImage: `url(${item.product.image_url})` }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <Link 
                        href={`/product/${item.product.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.product.category?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading[item.id] || item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="h-8 w-16 mx-2 text-center"
                      min={1}
                      disabled={loading[item.id]}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading[item.id]}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  ${item.product.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={loading[item.id]}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

