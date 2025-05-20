import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { UsersTable } from "@/components/admin/users/users-table"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Users | KG-Components Admin",
  description: "View and manage users in your KG-Components store.",
}

export default async function AdminUsersPage() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth")
  }
  
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()
  
  if (!profile?.is_admin) {
    redirect("/")
  }
  
  const { data: users } = await supabase
    .from("user_profiles")
    .select(`
      *,
      orders:orders(id)
    `)
    .order("created_at", { ascending: false })
  
  // Count orders for each user
  const usersWithOrderCount = users?.map(user => ({
    ...user,
    order_count: user.orders?.length || 0
  })) || []
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
          
          <UsersTable users={usersWithOrderCount} />
        </div>
      </div>
    </div>
  )
}

