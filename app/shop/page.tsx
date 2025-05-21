'use client';

import React, { useState } from 'react';
import { useProductStore } from '@/lib/store/productStore';
import ProductGrid from '@/components/shop/ProductGrid';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductSearch from '@/components/shop/ProductSearch';
import { Separator } from '@/components/ui/separator';

export default function ShopPage() {
  const { fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    fetchProducts({
      category: categoryId || undefined,
    });
  };

  const handleSearch = (query: string) => {
    fetchProducts({
      search: query,
      category: selectedCategory || undefined,
    });
  };

  const handleFilter = (filters: any) => {
    fetchProducts({
      ...filters,
      category: selectedCategory || undefined,
    });
  };

  const handleSort = (sortOption: string) => {
    fetchProducts({
      sort: sortOption,
      category: selectedCategory || undefined,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      
      <ProductSearch 
        onSearch={handleSearch} 
        onFilter={handleFilter} 
        onSort={handleSort} 
      />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <CategoryFilter 
            onSelectCategory={handleCategorySelect} 
            selectedCategory={selectedCategory} 
          />
        </div>
        
        <div className="md:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}

