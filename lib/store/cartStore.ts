import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
    category: {
      name: string
    }
  }
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  
  // Actions
  addToCart: (product: any, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Getters
  getCartTotal: () => number
  getItemCount: () => number
  syncWithSupabase: (userId: string) => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      addToCart: (product, quantity) => {
        const { items } = get()
        const existingItem = items.find(item => item.product_id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.product_id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            product_id: product.id,
            quantity,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              category: {
                name: product.category?.name || 'Uncategorized'
              }
            }
          }
          
          set({ items: [...items, newItem] })
        }
      },
      
      removeFromCart: (productId) => {
        const { items } = get()
        set({ items: items.filter(item => item.product_id !== productId) })
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get()
        
        if (quantity <= 0) {
          set({ items: items.filter(item => item.product_id !== productId) })
          return
        }
        
        set({
          items: items.map(item => 
            item.product_id === productId 
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          return total + (item.product.price * item.quantity)
        }, 0)
      },
      
      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },
      
      syncWithSupabase: async (userId) => {
        try {
          set({ isLoading: true, error: null })
          const supabase = createClient()
          const { items } = get()
          
          // Get cart items from Supabase
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products(
                id, name, price, image_url,
                category:categories(name)
              )
            `)
            .eq('user_id', userId)
          
          if (error) throw error
          
          // If there are items in local storage but not in Supabase, add them
          if (items.length > 0 && (!data || data.length === 0)) {
            const cartItems = items.map(item => ({
              user_id: userId,
              product_id: item.product_id,
              quantity: item.quantity
            }))
            
            await supabase.from('cart_items').insert(cartItems)
          } 
          // If there are items in Supabase, use those
          else if (data && data.length > 0) {
            set({ items: data as unknown as CartItem[] })
          }
          
          set({ isLoading: false })
        } catch (error: any) {
          console.error('Error syncing cart with Supabase:', error)
          set({ isLoading: false, error: error.message })
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)

