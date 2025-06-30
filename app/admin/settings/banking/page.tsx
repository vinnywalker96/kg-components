import { Button } from '@/components/ui/button'
import { BankingDetailsTable } from '@/components/admin/banking/banking-details-table'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banking Details | Admin Settings',
  description: 'Manage banking details for customer invoices.',
}

export default async function AdminBankingDetailsPage() {
  const supabase = createClient()
  
  const { data: bankingDetails } = await supabase
    .from('banking_details')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banking Details</h1>
        <Button asChild>
          <Link href="/admin/settings/banking/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Banking Details
          </Link>
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Manage banking details that will be shown on customer invoices.
      </p>
      
      <BankingDetailsTable bankingDetails={bankingDetails || []} />
    </div>
  )
}

