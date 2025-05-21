'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CreditCard 
} from 'lucide-react';

// Default placeholder image
const DEFAULT_IMAGE = '/images/placeholder-product.png';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const subtotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shipping;
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      toast({
        title: 'Order placed successfully',
        description: 'Thank you for your purchase!',
      });
      router.push('/orders');
      setIsCheckingOut(false);
    }, 2000);
  };
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button onClick={() => router.push('/shop')}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.product.id}>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={item.product.image_url || DEFAULT_IMAGE}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.product.id}`} className="font-medium hover:underline">
                        {item.product.name}
                      </Link>
                      
                      {item.product.category && (
                        <div className="text-sm text-gray-600">
                          {item.product.category.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right min-w-[80px]">
                      <div className="font-medium">
                        R{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        R{item.product.price.toFixed(2)} each
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  'Processing...'
                ) : (
                  <>
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600 mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure payment</span>
                </div>
                <p>We accept all major credit cards and PayPal</p>
              </div>
            </div>
          </Card>
          
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push('/shop')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

