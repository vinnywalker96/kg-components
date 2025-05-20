import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CategoriesTable } from "@/components/admin/categories/categories-table"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Categories | KG-Components Admin",
  description: "Add, edit, and manage product categories in your KG-Components store.",
}

export default async function AdminCategoriesPage() {
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
  
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      *,
      products:products(id)
    `)
    .order("name")
  
  // Count products in each category
  const categoriesWithCount = categories?.map(category => ({
    ...category,
    product_count: category.products?.length || 0
  })) || []
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Categories</h1>
            <Link href="/admin/categories/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
          
          <CategoriesTable categories={categoriesWithCount} />
        </div>
      </div>
    </div>
  )
}

