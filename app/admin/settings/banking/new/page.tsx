import { BankingDetailsForm } from '@/components/admin/banking/banking-details-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Banking Details | Admin Settings',
  description: 'Add new banking details for customer invoices.',
}

export default function NewBankingDetailsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Banking Details</h1>
      <BankingDetailsForm />
    </div>
  )
}

