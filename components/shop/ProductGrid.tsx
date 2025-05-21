import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductStore } from '@/lib/store/productStore';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/lib/hooks/use-toast';

// Default placeholder image
const DEFAULT_IMAGE = '/images/placeholder-product.png';

export function ProductGrid() {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-red-600">Error loading products</h3>
        <p className="text-gray-600 mt-2">{error}</p>
        <Button onClick={() => fetchProducts()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold">No products found</h3>
        <p className="text-gray-600 mt-2">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/product/${product.id}`}>
            <CardHeader className="p-0 h-48 relative overflow-hidden">
              <Image
                src={product.image_url || DEFAULT_IMAGE}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE;
                }}
              />
            </CardHeader>
          </Link>
          <CardContent className="p-4">
            <Link href={`/product/${product.id}`}>
              <CardTitle className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
            </Link>
            <div className="mt-2 flex items-center">
              <Badge variant="outline" className="mr-2">
                {product.category?.name || 'Uncategorized'}
              </Badge>
              {product.manufacturer && (
                <span className="text-xs text-gray-500">{product.manufacturer}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 pt-0">
            <div className="font-bold text-lg">
              {typeof product.price === 'number'
                ? `R${product.price.toFixed(2)}`
                : 'Price on request'}
            </div>
            <Button
              onClick={() => handleAddToCart(product)}
              size="sm"
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default ProductGrid;

