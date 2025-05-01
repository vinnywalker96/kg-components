
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, ProductWithCategory } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ProductState {
  products: ProductWithCategory[];
  categories: Category[];
  selectedCategory: string | null;
  isLoading: boolean;
  fetchProducts: (categoryId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductById: (id: string) => ProductWithCategory | undefined;
  setSelectedCategory: (categoryId: string | null) => void;
  searchProducts: (query: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,

  fetchProducts: async (categoryId) => {
    set({ isLoading: true });
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          category:categories(*)
        `);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query.order("name");

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      set({ products: data || [] });
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      set({ categories: data || [] });
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  },

  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
    get().fetchProducts(categoryId || undefined);
  },

  searchProducts: async (query) => {
    if (!query) {
      return get().fetchProducts(get().selectedCategory || undefined);
    }

    set({ isLoading: true });
    try {
      let dbQuery = supabase
        .from("products")
        .select(`
          *,
          category:categories(*)
        `)
        .ilike("name", `%${query}%`);

      if (get().selectedCategory) {
        dbQuery = dbQuery.eq("category_id", get().selectedCategory);
      }

      const { data, error } = await dbQuery.order("name");

      if (error) {
        console.error("Error searching products:", error);
        return;
      }

      set({ products: data || [] });
    } catch (error) {
      console.error("Product search error:", error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
