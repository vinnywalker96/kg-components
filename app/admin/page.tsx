import { DashboardCards } from '@/components/admin/dashboard-cards'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { RecentOrders } from '@/components/admin/recent-orders'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | KG-Components',
  description: 'Overview of your electronic components store performance.',
}

export default async function AdminDashboardPage() {
  const supabase = createClient()
  
  // Get recent orders
  const { data: recentOrders } = await supabase
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
    .limit(5)
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <DashboardCards />
      </div>
      
      <DashboardCharts />
      
      <RecentOrders orders={recentOrders || []} />
    </div>
  )
}

