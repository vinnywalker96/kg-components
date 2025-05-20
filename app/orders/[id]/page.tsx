import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'

interface OrderPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  return {
    title: `Order #${params.id.substring(0, 8)} | KG-Components`,
    description: 'View your order details and status.',
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth?redirect=/orders')
  }
  
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items(
        *,
        product:products(
          id,
          name,
          image_url
        )
      )
    `)
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()
  
  if (!order) {
    notFound()
  }
  
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
  
  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 1
      case 'processing':
        return 2
      case 'shipped':
        return 3
      case 'delivered':
        return 4
      case 'cancelled':
        return 0
      default:
        return 0
    }
  }
  
  const statusStep = getStatusStep(order.status)
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Order #{params.id.substring(0, 8)}</CardTitle>
                <div className="flex items-center mt-2 sm:mt-0">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-muted-foreground ml-4">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Order Status Progress */}
              {statusStep > 0 && (
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-between">
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, index) => (
                        <div key={status} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index + 1 <= statusStep 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="mt-2 text-xs font-medium">
                            {status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium py-3 px-4">Product</th>
                        <th className="text-center font-medium py-3 px-4">Quantity</th>
                        <th className="text-right font-medium py-3 px-4">Price</th>
                        <th className="text-right font-medium py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.order_items.map((item: any) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
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
                              <Link 
                                href={`/product/${item.product.id}`}
                                className="font-medium hover:underline"
                              >
                                {item.product.name}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-4 px-4 text-right">
                            ${item.price_per_unit.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            ${(item.price_per_unit * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(order.total_amount - (order.shipping_cost || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping_cost ? `$${order.shipping_cost.toFixed(2)}` : 'Free'}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-muted-foreground">
                  {order.shipping_address || 'No shipping address provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-muted-foreground">
                  Credit Card (ending in 1234)
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/contact">
                Need Help?
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

