'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { generateOrderId } from '@/lib/utils'

interface CartSummaryProps {
  items: any[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  
  const shippingCost = subtotal > 100 ? 0 : 10
  const total = subtotal + shippingCost
  
  const handleCheckout = async () => {
    if (items.length === 0) return
    
    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth?redirect=/cart')
        return
      }
      
      // Create order
      const orderId = generateOrderId()
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: session.user.id,
          total_amount: total,
          shipping_cost: shippingCost,
          status: 'pending',
        })
      
      if (orderError) throw orderError
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        quantity: item.quantity,
        price_per_unit: item.product.price,
      }))
      
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (orderItemsError) throw orderItemsError
      
      // Clear cart
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id)
      
      if (clearCartError) throw clearCartError
      
      // Redirect to order confirmation
      router.push(`/orders/${orderId}`)
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {subtotal < 100 && (
          <div className="text-sm text-muted-foreground mt-2">
            Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </CardFooter>
    </Card>
  )
}

