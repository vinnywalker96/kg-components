import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/lib/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  stock: number;
  sku?: string;
  manufacturer?: string;
  part_number?: string;
  featured: boolean;
  external_url?: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
}

interface ProductFilters {
  category_id?: string;
  price_min?: number;
  price_max?: number;
  manufacturer?: string;
  search?: string;
  featured?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: { id: string; name: string; count: number }[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  filters: {},
  
  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      const currentFilters = filters || get().filters;
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `);
      
      // Apply filters
      if (currentFilters.category_id) {
        query = query.eq('category_id', currentFilters.category_id);
      }
      
      if (currentFilters.price_min !== undefined) {
        query = query.gte('price', currentFilters.price_min);
      }
      
      if (currentFilters.price_max !== undefined) {
        query = query.lte('price', currentFilters.price_max);
      }
      
      if (currentFilters.manufacturer) {
        query = query.eq('manufacturer', currentFilters.manufacturer);
      }
      
      if (currentFilters.featured) {
        query = query.eq('featured', true);
      }
      
      if (currentFilters.search) {
        query = query.or(`name.ilike.%${currentFilters.search}%,description.ilike.%${currentFilters.search}%`);
      }
      
      // Apply sorting
      if (currentFilters.sort_by) {
        switch (currentFilters.sort_by) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name_desc':
            query = query.order('name', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('name', { ascending: true });
        }
      } else {
        query = query.order('name', { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ 
        products: data as Product[], 
        isLoading: false,
        filters: currentFilters,
      });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ error: error.message, isLoading: false });
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    }
  },
  
  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('featured', true)
        .limit(8);
      
      if (error) throw error;
      
      set({ featuredProducts: data as Product[], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          count:products(count)
        `)
        .order('name');
      
      if (error) throw error;
      
      const categoriesWithCount = data.map(category => ({
        id: category.id,
        name: category.name,
        count: category.count[0]?.count || 0,
      }));
      
      set({ categories: categoriesWithCount, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ isLoading: false });
      return data as Product;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  setFilters: (filters) => {
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, ...filters } });
    get().fetchProducts({ ...currentFilters, ...filters });
  },
  
  clearFilters: () => {
    set({ filters: {} });
    get().fetchProducts({});
  },
}));

