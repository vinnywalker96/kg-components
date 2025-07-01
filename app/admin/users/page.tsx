import { AdminManagement } from '@/components/admin/users/admin-management'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage users and admin privileges',
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <p className="text-muted-foreground">
        Manage users and admin privileges. The master admin account (vinnywalker96@gmail.com) cannot have its privileges revoked.
      </p>
      
      <AdminManagement />
    </div>
  )
}

