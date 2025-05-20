import { CartItems } from '@/components/cart/cart-items'
import { CartSummary } from '@/components/cart/cart-summary'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | KG-Components',
  description: 'View and manage items in your shopping cart.',
}

export default async function CartPage() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth?redirect=/cart')
  }
  
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(
        *,
        category:categories(name)
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems items={cartItems || []} />
        </div>
        <div>
          <CartSummary items={cartItems || []} />
        </div>
      </div>
    </div>
  )
}

