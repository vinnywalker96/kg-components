import { OrdersTable } from '@/components/admin/orders/orders-table'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Orders | Admin Dashboard',
  description: 'View and manage customer orders.',
}

export default async function AdminOrdersPage() {
  const supabase = createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      user:user_profiles(
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      
      <OrdersTable orders={orders || []} />
    </div>
  )
}

