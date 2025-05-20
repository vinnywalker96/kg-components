'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface RecentOrdersProps {
  orders: any[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          {orders.length} orders placed recently.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No recent orders found.
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Order #{order.id.substring(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.user?.full_name || 'Unknown User'}
                  </p>
                </div>
                <div className="ml-auto text-right space-y-1">
                  <div className="text-sm font-medium">
                    ${order.total_amount.toFixed(2)}
                  </div>
                  <div className="text-xs">
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="ml-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <Button variant="outline" asChild className="w-full">
            <Link href="/admin/orders">
              View All Orders
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

