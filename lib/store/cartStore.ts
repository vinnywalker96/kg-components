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
  checkout: (shippingAddress: string, paymentMethod: string) => Promise<{ success: boolean, orderId?: string, error?: string }>
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
        
          set({
            items: [
              ...items, 
              {
                id: crypto.randomUUID(),
                product_id: product.id,
                quantity,
                price: product.price,
                name: product.name,
                image_url: product.image_url
              }
            ]
          })
        }
      },
      
      removeFromCart: (productId) => {
        const { items } = get()
     
        set({
          items: items.filter(item => item.product_id !== productId)
        })

      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get()
        
        if (quantity <= 0) {

          set({
            items: items.filter(item => item.product_id !== productId)
          })

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

        return items.reduce((total, item) => total + (item.price * item.quantity), 0)

      },
      
      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },
      

      checkout: async (shippingAddress, paymentMethod) => {
        const { items, clearCart, getCartTotal } = get()
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          return { 
            success: false, 
            error: 'You must be logged in to checkout' 
          }
        }
        
        if (items.length === 0) {
          return { 
            success: false, 
            error: 'Your cart is empty' 
          }
        }
        
        try {
          set({ isLoading: true, error: null })
          
          // Create order
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              status: 'pending',
              total_amount: getCartTotal(),
              shipping_address: shippingAddress,
              payment_status: 'pending',
              payment_method: paymentMethod
            })
            .select('id')
            .single()
          
          if (orderError) {
            throw orderError
          }
          
          // Create order items
          const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }))
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)
          
          if (itemsError) {
            throw itemsError
          }
          
          // Clear cart after successful checkout
          clearCart()
          
          return { 
            success: true, 
            orderId: order.id 
          }
        } catch (error: any) {
          console.error('Checkout error:', error)
          set({ error: error.message })
          return { 
            success: false, 
            error: error.message 
          }
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

