import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category_id: string
  stock: number
  category?: {
    name: string
  }
}

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  categories: any[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProducts: (filters?: any) => Promise<Product[]>
  fetchFeaturedProducts: () => Promise<Product[]>
  fetchCategories: () => Promise<any[]>
  fetchProductById: (id: string) => Promise<Product | null>
  searchProducts: (query: string) => Promise<Product[]>
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
      
      // Apply category filter
      if (filters.category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', filters.category)
          .single()
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        }
      }
      
      // Apply price filters
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      
      // Apply search filter
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }
      
      // Apply sorting
      if (filters.sort) {
        const [field, order] = filters.sort.split('_')
        query = query.order(field, { ascending: order === 'asc' })
      } else {
        query = query.order('name', { ascending: true })
      }
      
      const { data, error } = await query
      
      if (error) {
        throw error
      }
      
      set({ products: data || [], isLoading: false })
      return data || []
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return []
    }
  },
  
  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('featured', true)
        .limit(6)
      
      if (error) {
        throw error
      }
      
      set({ featuredProducts: data || [], isLoading: false })
      return data || []
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return []
    }
  },
  
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      set({ categories: data || [], isLoading: false })
      return data || []
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return []
    }
  },
  
  fetchProductById: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        throw error
      }
      
      set({ isLoading: false })
      return data
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return null
    }
  },
  
  searchProducts: async (query) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      set({ isLoading: false })
      return data || []
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return []
    }
  }
}))

