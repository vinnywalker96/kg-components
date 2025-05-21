import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProductFilters) => void;
  onSort: (sortOption: string) => void;
}

interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export function ProductSearch({ onSearch, onFilter, onSort }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<ProductFilters>({
    minPrice: 0,
    maxPrice: 1000,
  });
  const [priceRange, setPriceRange] = React.useState([0, 1000]);
  const [sortOption, setSortOption] = React.useState('created_at:desc');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleApplyFilters = () => {
    const newFilters = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
    });
    onFilter({
      minPrice: 0,
      maxPrice: 1000,
    });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    onSort(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2">
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">Newest</SelectItem>
              <SelectItem value="created_at:asc">Oldest</SelectItem>
              <SelectItem value="price:asc">Price: Low to High</SelectItem>
              <SelectItem value="price:desc">Price: High to Low</SelectItem>
              <SelectItem value="name:asc">Name: A to Z</SelectItem>
              <SelectItem value="name:desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Adjust filters to find exactly what you're looking for.
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <Label>Price Range</Label>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Reset
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;

