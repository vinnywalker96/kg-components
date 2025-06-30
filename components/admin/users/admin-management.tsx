'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/providers/supabase-provider'
import { AlertCircle, CheckCircle, UserPlus, Shield, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export function AdminManagement() {
  const { supabase } = useSupabase()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [addingAdmin, setAddingAdmin] = useState(false)

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (error: any) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Add a new admin
  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingAdmin(true)
    setError(null)
    setSuccess(null)

    try {
      // First, check if the user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', newAdminEmail)
        .single()

      if (userError) {
        if (userError.code === 'PGRST116') {
          throw new Error(`No user found with email ${newAdminEmail}`)
        }
        throw userError
      }

      if (userData.role === 'admin') {
        throw new Error(`${newAdminEmail} is already an admin`)
      }

      // Update the user's role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userData.id)

      if (updateError) throw updateError

      setSuccess(`${newAdminEmail} has been made an admin successfully`)
      setNewAdminEmail('')
      fetchUsers() // Refresh the user list
    } catch (error: any) {
      console.error('Error adding admin:', error)
      setError(error.message)
    } finally {
      setAddingAdmin(false)
    }
  }

  // Remove admin privileges
  const removeAdmin = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove admin privileges from ${email}?`)) {
      return
    }

    try {
      setError(null)
      setSuccess(null)

      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', userId)

      if (error) throw error

      setSuccess(`Admin privileges removed from ${email}`)
      fetchUsers() // Refresh the user list
    } catch (error: any) {
      console.error('Error removing admin:', error)
      setError(error.message)
    }
  }

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
          <CardDescription>
            Grant admin privileges to an existing user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={addAdmin} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={addingAdmin}>
              <UserPlus className="mr-2 h-4 w-4" />
              {addingAdmin ? 'Adding...' : 'Add Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.role === 'admin' ? (
                            <div className="flex items-center text-amber-600">
                              <Shield className="mr-1 h-4 w-4" />
                              Admin
                            </div>
                          ) : (
                            <div className="flex items-center text-slate-600">
                              <User className="mr-1 h-4 w-4" />
                              User
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === 'admin' && user.email !== 'vinnywalker96@gmail.com' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeAdmin(user.id, user.email || '')}
                          >
                            Remove Admin
                          </Button>
                        )}
                        {user.email === 'vinnywalker96@gmail.com' && (
                          <span className="text-sm text-muted-foreground">Master Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

