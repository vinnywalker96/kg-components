'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'

interface UsersTableProps {
  users: any[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium py-3 px-4">User</th>
                <th className="text-left font-medium py-3 px-4">Email</th>
                <th className="text-right font-medium py-3 px-4">Orders</th>
                <th className="text-center font-medium py-3 px-4">Admin</th>
                <th className="text-right font-medium py-3 px-4">Joined</th>
                <th className="text-right font-medium py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0 mr-3">
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                        </div>
                        <div className="font-medium">{user.full_name || 'Unknown User'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.order_count}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.is_admin ? (
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

