import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardCards } from "@/components/admin/dashboard-cards"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { RecentOrders } from "@/components/admin/recent-orders"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | KG-Components",
  description: "Manage your KG-Components store, products, orders, and customers.",
}

export default async function AdminPage() {
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
  
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      user:user_profiles(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5)
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <DashboardCards />
          
          <div className="mt-8">
            <DashboardCharts />
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <RecentOrders orders={recentOrders || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

