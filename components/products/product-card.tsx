'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useLanguage } from '@/lib/i18n/language-context'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    stock: number
    category?: {
      name: string
    } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { supabase, user } = useSupabase()
  const { t } = useLanguage()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast({
        title: t('error'),
        description: t('loginToAddToCart'),
        variant: 'destructive',
      })
      return
    }
    
    if (product.stock <= 0) {
      toast({
        title: t('error'),
        description: t('outOfStock'),
        variant: 'destructive',
      })
      return
    }
    
    setIsAddingToCart(true)
    
    try {
      // Check if product already in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single()
      
      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        // Add new item
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          })
      }
      
      toast({
        title: t('success'),
        description: t('addedToCart'),
      })
      
      // Refresh cart count
      router.refresh()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: t('error'),
        description: t('errorAddingToCart'),
        variant: 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  return (
    <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <a href={`/product/${product.id}`} className="block">
        <div className="aspect-square relative">
          <img
            src={product.image_url || '/images/product-placeholder.png'}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-bold">${product.price.toFixed(2)}</span>
            {product.category && (
              <span className="text-xs text-muted-foreground">
                {product.category.name}
              </span>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? t('inStock') : t('outOfStock')}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
            >
              {isAddingToCart ? t('adding') : t('addToCart')}
            </Button>
          </div>
        </div>
      </a>
    </div>
  )
}

