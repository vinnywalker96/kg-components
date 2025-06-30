'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'

type BankingDetails = Database['public']['Tables']['banking_details']['Row']

interface BankingDetailsFormProps {
  bankingDetails?: BankingDetails | null
}

export function BankingDetailsForm({ bankingDetails }: BankingDetailsFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Omit<BankingDetails, 'id' | 'created_at' | 'updated_at'>>({
    bank_name: bankingDetails?.bank_name || '',
    account_name: bankingDetails?.account_name || '',
    account_number: bankingDetails?.account_number || '',
    branch_code: bankingDetails?.branch_code || '',
    swift_code: bankingDetails?.swift_code || '',
    is_default: bankingDetails?.is_default || false,
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_default: checked }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (bankingDetails) {
        // Update existing banking details
        const { error } = await supabase
          .from('banking_details')
          .update({
            bank_name: formData.bank_name,
            account_name: formData.account_name,
            account_number: formData.account_number,
            branch_code: formData.branch_code,
            swift_code: formData.swift_code,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bankingDetails.id)
        
        if (error) throw error
      } else {
        // Create new banking details
        const { error } = await supabase
          .from('banking_details')
          .insert({
            bank_name: formData.bank_name,
            account_name: formData.account_name,
            account_number: formData.account_number,
            branch_code: formData.branch_code,
            swift_code: formData.swift_code,
            is_default: formData.is_default,
          })
        
        if (error) throw error
      }
      
      router.refresh()
      router.push('/admin/settings')
    } catch (error: any) {
      console.error('Error saving banking details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{bankingDetails ? 'Edit Banking Details' : 'Add Banking Details'}</CardTitle>
          <CardDescription>
            These banking details will be shown on invoices sent to customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="account_name">Account Name</Label>
            <Input
              id="account_name"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="branch_code">Branch Code</Label>
            <Input
              id="branch_code"
              name="branch_code"
              value={formData.branch_code || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="swift_code">SWIFT Code</Label>
            <Input
              id="swift_code"
              name="swift_code"
              value={formData.swift_code || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is_default">Set as default banking details</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Banking Details'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

