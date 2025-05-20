import { AccountDetails } from "@/components/account/account-details"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account | KG-Components",
  description: "Manage your KG-Components account details and preferences.",
}

export default async function AccountPage() {
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <AccountSidebar />
        </div>
        <div className="flex-grow">
          <AccountDetails profile={profile} user={session.user} />
        </div>
      </div>
    </div>
  )
}

