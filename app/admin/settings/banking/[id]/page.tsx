import { BankingDetailsForm } from '@/components/admin/banking/banking-details-form'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface BankingDetailsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BankingDetailsPageProps): Promise<Metadata> {
  return {
    title: 'Edit Banking Details | Admin Settings',
    description: 'Edit banking details for customer invoices.',
  }
}

export default async function EditBankingDetailsPage({ params }: BankingDetailsPageProps) {
  const supabase = createClient()
  
  const { data: bankingDetails } = await supabase
    .from('banking_details')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (!bankingDetails) {
    notFound()
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Banking Details</h1>
      <BankingDetailsForm bankingDetails={bankingDetails} />
    </div>
  )
}

