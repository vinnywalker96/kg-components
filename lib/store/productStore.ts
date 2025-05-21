import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string | null
  category_id: string
  sku: string | null
  created_at: string
  updated_at: string
  category: {
    id: string

 
}


interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  product_count: number
}

interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: string
}


interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  categories: any[]
  isLoading: boolean
  error: string | null
  
  // Actions

  fetchProducts: (filters?: ProductFilters) => Promise<void>
  fetchFeaturedProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  searchProducts: (query: string) => Promise<void>




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

          category:categories(id, name)
        `)
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }
      
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }
      

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

          category:categories(id, name)

        `)
        .eq('featured', true)
        .limit(6)
      

   if(error) {
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

        .select(`
          *,
          product_count:products(count)
        `)
        .order('name')
      
      if (error) throw error
      
      // Transform the data to get the count
      const categories = data.map(category => ({
        ...category,
        product_count: category.product_count?.[0]?.count || 0
      }))
      
      set({ categories: categories as unknown as Category[], isLoading: false })
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      set({ isLoading: false, error: error.message })
    }
  },
  
  searchProducts: async (query: string) => {
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

          category:categories(id, name)
        `)
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .order('name')
      
      if (error) throw error
      
      set({ products: data as unknown as Product[], isLoading: false })
    } catch (error: any) {
      console.error('Error searching products:', error)
      set({ isLoading: false, error: error.message })

      set({ isLoading: false })
      return data || []
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return []

    }
  }
}))

