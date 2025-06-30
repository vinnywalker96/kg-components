'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'
import { Edit, Trash2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type BankingDetails = Database['public']['Tables']['banking_details']['Row']

interface BankingDetailsTableProps {
  bankingDetails: BankingDetails[]
}

export function BankingDetailsTable({ bankingDetails }: BankingDetailsTableProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete these banking details?')) {
      return
    }
    
    setLoading(prev => ({ ...prev, [id]: true }))
    setError(null)
    
    try {
      const { error } = await supabase
        .from('banking_details')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting banking details:', error)
      setError(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }
  
  const handleSetDefault = async (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    setError(null)
    
    try {
      const { error } = await supabase
        .from('banking_details')
        .update({ is_default: true })
        .eq('id', id)
      
      if (error) throw error
      
      router.refresh()
    } catch (error: any) {
      console.error('Error setting default banking details:', error)
      setError(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }
  
  if (bankingDetails.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No banking details found</h3>
        <p className="text-muted-foreground mb-6">
          Add banking details to include on customer invoices.
        </p>
        <Button asChild>
          <Link href="/admin/settings/banking/new">
            Add Banking Details
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left font-medium p-3">Bank Name</th>
              <th className="text-left font-medium p-3">Account Name</th>
              <th className="text-left font-medium p-3">Account Number</th>
              <th className="text-center font-medium p-3">Default</th>
              <th className="text-right font-medium p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bankingDetails.map((details) => (
              <tr key={details.id} className="border-t">
                <td className="p-3">{details.bank_name}</td>
                <td className="p-3">{details.account_name}</td>
                <td className="p-3">{details.account_number}</td>
                <td className="p-3 text-center">
                  {details.is_default ? (
                    <CheckCircle className="h-5 w-5 text-green-500 inline" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(details.id)}
                      disabled={loading[details.id]}
                    >
                      Set Default
                    </Button>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href={`/admin/settings/banking/${details.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(details.id)}
                      disabled={loading[details.id] || details.is_default}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

