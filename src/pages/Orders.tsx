
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Package, Calendar, Clock } from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";

const Orders = () => {
  const { orders, isLoading, fetchUserOrders } = useOrderStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, fetchUserOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <Card className="p-8 max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Browse our products and make your first purchase!
            </p>
            <Link to="/shop">
              <Button>Shop Now</Button>
            </Link>
          </Card>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id.substring(0, 8)}...
                    </CardTitle>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.created_at)}
                      <Clock className="h-4 w-4 ml-2" />
                      {formatTime(order.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1">
                    {getStatusBadge(order.status)}
                    <span className="font-semibold">
                      Total: ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="items">
                    <AccordionTrigger>
                      Order Items ({order.items.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4"
                          >
                            <div className="flex gap-4">
                              <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {item.product.image_url ? (
                                  <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div>
                                <Link
                                  to={`/product/${item.product_id}`}
                                  className="font-semibold hover:text-blue-600"
                                >
                                  {item.product.name}
                                </Link>
                                <div className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">
                              ${Number(item.price_per_unit).toFixed(2)} each
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-6">
                  {order.status === "pending" && (
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-md mb-4">
                      <p className="font-medium">Payment Instructions</p>
                      <p className="text-sm mt-1">
                        Please transfer ${Number(order.total_amount).toFixed(2)} to our bank account:
                      </p>
                      <div className="text-sm mt-2">
                        <p>Bank: Example Bank</p>
                        <p>Account Name: KG Components</p>
                        <p>Account Number: 1234-5678-9012-3456</p>
                        <p>Reference: {order.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  )}

                  {order.invoice_sent && (
                    <p className="text-sm text-green-600 mb-2">
                      ✓ Invoice sent to your email
                    </p>
                  )}

                  {order.payment_confirmed && (
                    <p className="text-sm text-green-600 mb-2">
                      ✓ Payment confirmed
                    </p>
                  )}

                  <Link to="/shop">
                    <Button variant="outline">Shop More</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RequireAuth>
  );
};

export default Orders;
