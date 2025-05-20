import { OrdersList } from '@/components/orders/orders-list'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders | KG-Components',
  description: 'View your order history and track your purchases.',
}

export default async function OrdersPage() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth?redirect=/orders')
  }
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items(
        *,
        product:products(
          id,
          name,
          image_url
        )
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <OrdersList orders={orders || []} />
      </div>
    </div>
  )
}

