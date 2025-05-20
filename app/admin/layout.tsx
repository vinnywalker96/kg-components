import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | KG-Components',
  description: 'Manage your electronic components store.',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth?redirect=/admin')
  }
  
  // Check if user is admin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()
  
  if (!userProfile?.is_admin) {
    redirect('/')
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}

