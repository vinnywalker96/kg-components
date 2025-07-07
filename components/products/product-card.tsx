'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from '@/components/ui/use-toast'
import { ShoppingCart, Eye } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
  inStock?: boolean
}

export function ProductCard({ id, name, description, price, image, category, inStock = true }: ProductCardProps) {
  const { t } = useLanguage()
  const { supabase, user } = useSupabase()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: t('error'),
        description: t('loginToAddToCart'),
        variant: 'destructive',
      })
      return
    }
    
    setIsAddingToCart(true)
    
    try {
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }
      
      if (existingItem) {
        // Update quantity if already in cart
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
        
        if (updateError) throw updateError
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: id,
            quantity: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (insertError) throw insertError
      }
      
      toast({
        title: t('success'),
        description: t('addedToCart'),
      })
      
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('errorAddingToCart'),
        variant: 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative h-48 bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            {category && (
              <p className="text-xs text-muted-foreground mb-1">{category}</p>
            )}
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="text-lg font-bold">
            ${price.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          asChild
        >
          <Link href={`/products/${id}`}>
            <Eye className="h-4 w-4 mr-2" />
            {t('details')}
          </Link>
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAddingToCart ? t('adding') : t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  )
}

