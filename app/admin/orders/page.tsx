import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { OrdersTable } from "@/components/admin/orders/orders-table"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Orders | KG-Components Admin",
  description: "View and manage customer orders in your KG-Components store.",
}

export default async function AdminOrdersPage() {
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
  
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      user:user_profiles(full_name)
    `)
    .order("created_at", { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
          
          <OrdersTable orders={orders || []} />
        </div>
      </div>
    </div>
  )
}

