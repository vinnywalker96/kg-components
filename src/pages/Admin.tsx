
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import RequireAuth from "@/components/auth/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User, ShoppingBag, DollarSign, Package, Send, AlertCircle, CheckCircle } from "lucide-react";

const Admin = () => {
  const { isLoading: authLoading } = useAuthStore();
  const { orders, isLoading: ordersLoading, fetchAllOrders, updateOrderStatus, sendInvoice, confirmPayment } = useOrderStore();
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalSales: 0,
  });

  useEffect(() => {
    fetchAllOrders();
    fetchUsers();
  }, [fetchAllOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      calculateStats();
    }
  }, [orders]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Users fetch error:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const calculateStats = () => {
    const newStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      completed: orders.filter(o => o.status === "completed").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      totalSales: orders.reduce((sum, order) => {
        if (order.status !== "cancelled") {
          return sum + Number(order.total_amount);
        }
        return sum;
      }, 0),
    };
    setStats(newStats);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const handleSendInvoice = async (orderId: string) => {
    await sendInvoice(orderId);
  };

  const handleConfirmPayment = async (orderId: string) => {
    await confirmPayment(orderId);
  };

  const isLoading = authLoading || ordersLoading;

  const getChartData = () => {
    const ordersByDate = orders.reduce((acc: Record<string, { date: string; orders: number; sales: number }>, order) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      if (!acc[date]) {
        acc[date] = { date, orders: 0, sales: 0 };
      }
      
      acc[date].orders += 1;
      
      if (order.status !== "cancelled") {
        acc[date].sales += Number(order.total_amount);
      }
      
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(ordersByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  return (
    <RequireAuth requireAdmin>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pending Orders
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Completed Orders
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Sales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalSales.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Chart */}
        {!isLoading && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="sales" name="Sales ($)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="orders" className="mt-8">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6">
            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 justify-between">
                        <div>
                          <Skeleton className="h-6 w-40 mb-2" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-8 w-28" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-500">
                  No orders found
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 justify-between">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order #{order.id.substring(0, 8)}...
                          </h3>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.created_at)} • ${Number(order.total_amount).toFixed(2)}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            ${order.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                            ${order.status === "processing" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                            ${order.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""}
                            ${order.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" : ""}
                          `}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Items: {order.items.length} • 
                          Customer ID: {order.user_id.substring(0, 8)}...
                          {order.invoice_sent && " • Invoice sent"}
                          {order.payment_confirmed && " • Payment confirmed"}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {order.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, "processing")}
                            >
                              Mark as Processing
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendInvoice(order.id)}
                              disabled={order.invoice_sent}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {order.invoice_sent ? "Invoice Sent" : "Send Invoice"}
                            </Button>
                          </>
                        )}
                        {order.status === "processing" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, "completed")}
                            >
                              Mark as Completed
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConfirmPayment(order.id)}
                              disabled={order.payment_confirmed}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              {order.payment_confirmed ? "Payment Confirmed" : "Confirm Payment"}
                            </Button>
                          </>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(order.id, "cancelled")}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div>
                          <Skeleton className="h-6 w-40 mb-2" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : users.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-500">
                  No users found
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {user.full_name || "No Name"}
                            {user.is_admin && (
                              <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                                Admin
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">
                            User ID: {user.id.substring(0, 8)}... • 
                            Joined: {formatDate(user.created_at)}
                          </p>
                          {user.address && (
                            <p className="text-sm text-gray-600 mt-2">
                              Address: {user.address}
                            </p>
                          )}
                          {user.phone && (
                            <p className="text-sm text-gray-600">
                              Phone: {user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
};

export default Admin;
