'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Package, 
  Truck, 
  Info, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Default placeholder image
const DEFAULT_IMAGE = '/images/placeholder-product.png';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name)
          `)
          .eq('id', params.id)
          .single();
        
        if (error) throw error;
        
        setProduct(data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart`);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist or has been removed.'}</p>
          <Button onClick={() => router.push('/shop')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shop?category=${product.category?.id}`}>
              {product.category?.name || 'Uncategorized'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image_url || DEFAULT_IMAGE}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            {product.category && (
              <Badge variant="outline" className="mr-2">
                {product.category.name}
              </Badge>
            )}
            {product.manufacturer && (
              <span className="text-sm text-gray-600">
                Manufacturer: {product.manufacturer}
              </span>
            )}
          </div>
          
          <div className="text-2xl font-bold mb-4">
            {typeof product.price === 'number'
              ? `R${product.price.toFixed(2)}`
              : 'Price on request'}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {product.sku && (
            <div className="text-sm text-gray-600 mb-2">
              SKU: {product.sku}
            </div>
          )}
          
          {product.part_number && (
            <div className="text-sm text-gray-600 mb-4">
              Part Number: {product.part_number}
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              size="lg"
              disabled={product.stock <= 0}
              className="flex-1"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-600" />
              <span>
                {product.stock > 0 
                  ? `In stock (${product.stock} available)` 
                  : 'Out of stock'}
              </span>
            </div>
            
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-gray-600" />
              <span>Free shipping on orders over R1000</span>
            </div>
            
            {product.external_url && (
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-gray-600" />
                <a 
                  href={product.external_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Mantech
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

