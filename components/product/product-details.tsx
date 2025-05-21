'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check } from 'lucide-react'

interface ProductDetailsProps {
  product: any
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { supabase } = useSupabase()
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }
  
  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/auth?redirect=/product/${product.id}`)
      return
    }
    
    setLoading(true)
    
    try {
      addToCart(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center mt-2">
          <div className="text-sm px-2 py-1 bg-muted rounded-md">
            {product.category?.name}
          </div>
          <div className="ml-4 text-sm text-muted-foreground">
            SKU: {product.sku || 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="text-2xl font-bold">
        ${product.price.toFixed(2)}
      </div>
      
      <div className="prose max-w-none dark:prose-invert">
        <p>{product.description || 'No description available.'}</p>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-2">Quantity</div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={loading}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="h-10 w-20 mx-2 text-center"
            min={1}
            disabled={loading}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setQuantity(quantity + 1)}
            disabled={loading}
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={loading || added}
        >
          {added ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      
      <div className="border-t pt-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-1">Availability</div>
            <div className="text-sm text-muted-foreground">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Shipping</div>
            <div className="text-sm text-muted-foreground">
              Free shipping on orders over $100
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

