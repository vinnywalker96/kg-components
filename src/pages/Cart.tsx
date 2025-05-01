import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { X, Minus, Plus, ShoppingCart, AlertTriangle } from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
  const { items, total, isLoading, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder, isLoading: orderLoading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleQuantityChange = (id: string, currentQty: number, change: number) => {
    const newQuantity = currentQty + change;
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = async () => {
    await createOrder();
    navigate("/orders");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-24 w-24 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="w-24 text-right">
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                  {i < 2 && <Separator className="my-6" />}
                </div>
              ))}
            </Card>
          </div>
          <div>
            <Card className="p-6">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="h-24 w-24 bg-gray-100 rounded overflow-hidden">
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

                    <div className="flex-1">
                      <Link to={`/product/${item.product_id}`}>
                        <h3 className="font-semibold hover:text-blue-600">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        {item.product.category?.name || "Uncategorized"}
                      </div>

                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        {item.quantity >= item.product.stock_quantity && (
                          <span className="ml-2 text-sm text-amber-600 inline-flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Max available
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="font-semibold">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {index < items.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={orderLoading}
              >
                {orderLoading ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <div className="mt-4 text-center">
                <Link
                  to="/shop"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Cart;
