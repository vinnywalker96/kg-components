import { AccountSidebar } from "@/components/account/account-sidebar"
import { OrdersList } from "@/components/orders/orders-list"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Orders | KG-Components",
  description: "View and manage your orders from KG-Components.",
}

export default async function OrdersPage() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth")
  }
  
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AccountSidebar />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          <OrdersList orders={orders || []} />
        </div>
      </div>
    </div>
  )
}

