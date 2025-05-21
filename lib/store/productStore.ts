import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: string;
  sku: string | null;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  product_count: number;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `);
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      // Apply sorting
      if (filters.sort) {
        const [field, direction] = filters.sort.split(':');
        query = query.order(field, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ products: data as unknown as Product[], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ isLoading: false, error: error.message });
    }
  },
  
  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('featured', true)
        .limit(6);
      
      if (error) throw error;
      
      set({ featuredProducts: data as unknown as Product[], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      set({ isLoading: false, error: error.message });
    }
  },
  
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          product_count:products(count)
        `)
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to get the count
      const categories = data.map(category => ({
        ...category,
        product_count: category.product_count?.[0]?.count || 0
      }));
      
      set({ categories: categories as unknown as Category[], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      set({ isLoading: false, error: error.message });
    }
  },
  
  searchProducts: async (query: string) => {
    try {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ products: data as unknown as Product[], isLoading: false });
    } catch (error: any) {
      console.error('Error searching products:', error);
      set({ isLoading: false, error: error.message });
    }
  },
}));

