'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Eye, Mail, CheckCircle } from 'lucide-react'
import { useOrderStore } from '@/lib/store/orderStore'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrdersTableProps {
  orders: any[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const { updateOrderStatus, confirmPayment, sendInvoice } = useOrderStore()
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const handleStatusChange = async (orderId: string, status: string) => {
    setLoading(prev => ({ ...prev, [`status-${orderId}`]: true }))
    setError(null)
    
    try {
      await updateOrderStatus(orderId, status as any)
      router.refresh()
    } catch (error: any) {
      console.error('Error updating order status:', error)
      setError(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [`status-${orderId}`]: false }))
    }
  }
  
  const handleConfirmPayment = async (orderId: string) => {
    setLoading(prev => ({ ...prev, [`payment-${orderId}`]: true }))
    setError(null)
    
    try {
      await confirmPayment(orderId)
      router.refresh()
    } catch (error: any) {
      console.error('Error confirming payment:', error)
      setError(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [`payment-${orderId}`]: false }))
    }
  }
  
  const handleSendInvoice = async (orderId: string, userEmail: string) => {
    setLoading(prev => ({ ...prev, [`invoice-${orderId}`]: true }))
    setError(null)
    
    try {
      const result = await sendInvoice(orderId, userEmail)
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      router.refresh()
    } catch (error: any) {
      console.error('Error sending invoice:', error)
      setError(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [`invoice-${orderId}`]: false }))
    }
  }
  
  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No orders found</h3>
        <p className="text-muted-foreground">
          Orders will appear here once customers make purchases.
        </p>
      </Card>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left font-medium p-3">Order ID</th>
                <th className="text-left font-medium p-3">Customer</th>
                <th className="text-left font-medium p-3">Date</th>
                <th className="text-left font-medium p-3">Status</th>
                <th className="text-left font-medium p-3">Payment</th>
                <th className="text-right font-medium p-3">Total</th>
                <th className="text-right font-medium p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 font-medium">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="p-3">
                    {order.user?.name || 'Unknown'}
                    <div className="text-sm text-muted-foreground">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="p-3">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="p-3">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={loading[`status-${order.id}`]}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    {order.payment_status === 'paid' ? (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.payment_status)}`}>
                        Paid
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmPayment(order.id)}
                        disabled={loading[`payment-${order.id}`]}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm Payment
                      </Button>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendInvoice(order.id, order.user?.email)}
                        disabled={loading[`invoice-${order.id}`] || !order.user?.email}
                        title={order.user?.email ? 'Send Invoice' : 'No email available'}
                      >
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Send Invoice</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
