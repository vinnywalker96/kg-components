import React from 'react';
import { useProductStore } from '@/lib/store/productStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

export function CategoryFilter({ onSelectCategory, selectedCategory }: CategoryFilterProps) {
  const { categories, isLoading, error, fetchCategories } = useProductStore();

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full mb-2" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <p className="text-red-500 text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchCategories()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Categories</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-1">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(null)}
          >
            All Categories
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectCategory(category.id)}
            >
              <span className="truncate">{category.name}</span>
              {category.product_count > 0 && (
                <span className="ml-auto text-xs bg-primary-foreground text-primary rounded-full px-2 py-0.5">
                  {category.product_count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default CategoryFilter;

