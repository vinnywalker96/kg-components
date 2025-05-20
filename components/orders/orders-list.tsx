'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface OrdersListProps {
  orders: any[]
}

export function OrdersList({ orders }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
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
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet.
          </p>
          <Button asChild>
            <Link href="/account">
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center">
                  <span className="font-medium">Order #{order.id.substring(0, 8)}</span>
                  <span className={`ml-3 inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Placed on {formatDate(order.created_at)}
                </div>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/orders/${order.id}`} className="flex items-center">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {order.order_items.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-12 h-12 bg-muted rounded flex-shrink-0 mr-4">
                      {item.product.image_url ? (
                        <div 
                          className="h-full w-full bg-cover bg-center rounded" 
                          style={{ backgroundImage: `url(${item.product.image_url})` }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price_per_unit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {order.order_items.length > 3 && (
                  <div className="text-sm text-muted-foreground pt-2">
                    + {order.order_items.length - 3} more items
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="font-bold">${order.total_amount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

