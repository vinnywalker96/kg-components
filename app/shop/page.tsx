'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/lib/store/productStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  Search,
  ShoppingBag
} from 'lucide-react';
import { useMobile } from '@/lib/hooks/use-mobile';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { 
    products, 
    categories, 
    isLoading, 
    filters, 
    fetchProducts, 
    fetchCategories, 
    setFilters, 
    clearFilters 
  } = useProductStore();
  const isMobile = useMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Get category from URL if present
    const categoryId = searchParams.get('category');
    
    // Initialize filters
    const initialFilters = categoryId ? { category_id: categoryId } : {};
    
    // Fetch products with initial filters
    fetchProducts(initialFilters);
    
    // Fetch categories
    fetchCategories();
  }, [searchParams, fetchProducts, fetchCategories]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };
  
  const handleCategoryClick = (categoryId: string) => {
    setFilters({ category_id: categoryId });
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    clearFilters();
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile filter toggle */}
        {isMobile && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={toggleFilters}
              className="w-full flex items-center justify-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        )}
        
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-full md:w-64 space-y-6">
            <Card className="p-4">
              <h2 className="font-medium mb-3 flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </h2>
              
              <Separator className="my-3" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={filters.category_id === category.id ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name} ({category.count})
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>
        )}
        
        {/* Products */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="rounded-l-none">
                Search
              </Button>
            </form>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card className="p-8 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching your criteria.
              </p>
              <Button onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div 
                    className="h-48 bg-gray-100 bg-cover bg-center" 
                    style={{ backgroundImage: product.image_url ? `url(${product.image_url})` : 'none' }}
                  >
                    {!product.image_url && (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      {product.category?.name || 'Uncategorized'}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-bold">R{product.price.toFixed(2)}</div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="flex">
                    <div 
                      className="w-32 h-32 bg-gray-100 bg-cover bg-center" 
                      style={{ backgroundImage: product.image_url ? `url(${product.image_url})` : 'none' }}
                    >
                      {!product.image_url && (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {product.category?.name || 'Uncategorized'}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {product.description || 'No description available'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="font-bold">R{product.price.toFixed(2)}</div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

