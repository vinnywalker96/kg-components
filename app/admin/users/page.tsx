import { UsersTable } from '@/components/admin/users/users-table'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Users | Admin Dashboard',
  description: 'View and manage user accounts.',
}

export default async function AdminUsersPage() {
  const supabase = createClient()
  
  // Get users with order count
  const { data: users } = await supabase
    .from('user_profiles')
    .select(`
      *,
      orders:orders(count)
    `)
    .order('created_at', { ascending: false })
  
  // Transform data to include order count
  const usersWithCount = users?.map(user => ({
    ...user,
    order_count: user.orders.length
  })) || []
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>
      
      <UsersTable users={usersWithCount} />
    </div>
  )
}

