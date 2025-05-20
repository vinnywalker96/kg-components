import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ProductsTable } from "@/components/admin/products/products-table"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Products | KG-Components Admin",
  description: "Add, edit, and manage products in your KG-Components store.",
}

export default async function AdminProductsPage() {
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
  
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .order("name")
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
          
          <ProductsTable products={products || []} />
        </div>
      </div>
    </div>
  )
}

