import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

interface CartItem {
  id: string
  product_id: string
  quantity: number
  price: number
  name: string
  image_url: string | null
}

// Define the type for cart items from Supabase
type CartItemWithProduct = {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
  }
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  
  // Actions
  addToCart: (product: any, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncCartWithSupabase: () => Promise<void>
  getCartTotal: () => number
  getItemCount: () => number
  checkout: (shippingAddress: string, paymentMethod: string) => Promise<{ success: boolean, orderId?: string, error?: string }>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      // Sync cart with Supabase
      syncCartWithSupabase: async () => {
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          if (!session) {
            // If not logged in, just use local cart
            return
          }
          
          set({ isLoading: true, error: null })
          
          // Get cart items from Supabase
          const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products(
                id,
                name,
                price,
                image_url
              )
            `)
            .eq('user_id', session.user.id)
          
          if (error) throw error
          
          // Transform to our CartItem format
          const transformedItems = cartItems?.map((item: CartItemWithProduct) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            image_url: item.product.image_url
          })) || []
          
          set({ items: transformedItems, isLoading: false })
        } catch (error: any) {
          console.error('Error syncing cart with Supabase:', error)
          set({ error: error.message, isLoading: false })
        }
      },
      
      addToCart: async (product, quantity) => {
        const { items } = get()
        const existingItem = items.find(item => item.product_id === product.id)
        
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          // Update local state first for immediate feedback
          if (existingItem) {
            set({
              items: items.map(item => 
                item.product_id === product.id 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              )
            })
          } else {
            const newItem = {
              id: crypto.randomUUID(),
              product_id: product.id,
              quantity,
              price: product.price,
              name: product.name,
              image_url: product.image_url
            }
            
            set({
              items: [...items, newItem]
            })
          }
          
          // If user is logged in, sync with Supabase
          if (session) {
            set({ isLoading: true })
            
            if (existingItem) {
              // Update existing cart item
              const { error } = await supabase
                .from('cart_items')
                .update({ 
                  quantity: existingItem.quantity + quantity,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', session.user.id)
                .eq('product_id', product.id)
              
              if (error) throw error
            } else {
              // Insert new cart item
              const { error } = await supabase
                .from('cart_items')
                .insert({
                  user_id: session.user.id,
                  product_id: product.id,
                  quantity
                })
              
              if (error) throw error
            }
            
            // Refresh cart from Supabase to ensure consistency
            await get().syncCartWithSupabase()
          }
        } catch (error: any) {
          console.error('Error adding to cart:', error)
          set({ error: error.message, isLoading: false })
        } finally {
          set({ isLoading: false })
        }
      },
      
      removeFromCart: async (productId) => {
        const { items } = get()
        
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          // Update local state first
          set({
            items: items.filter(item => item.product_id !== productId)
          })
          
          // If user is logged in, sync with Supabase
          if (session) {
            set({ isLoading: true })
            
            const { error } = await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', session.user.id)
              .eq('product_id', productId)
            
            if (error) throw error
          }
        } catch (error: any) {
          console.error('Error removing from cart:', error)
          set({ error: error.message, isLoading: false })
        } finally {
          set({ isLoading: false })
        }
      },
      
      updateQuantity: async (productId, quantity) => {
        const { items } = get()
        
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            return get().removeFromCart(productId)
          }
          
          // Update local state first
          set({
            items: items.map(item => 
              item.product_id === productId 
                ? { ...item, quantity } 
                : item
            )
          })
          
          // If user is logged in, sync with Supabase
          if (session) {
            set({ isLoading: true })
            
            const { error } = await supabase
              .from('cart_items')
              .update({ 
                quantity,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', session.user.id)
              .eq('product_id', productId)
            
            if (error) throw error
          }
        } catch (error: any) {
          console.error('Error updating cart quantity:', error)
          set({ error: error.message, isLoading: false })
        } finally {
          set({ isLoading: false })
        }
      },
      
      clearCart: async () => {
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          // Clear local state
          set({ items: [] })
          
          // If user is logged in, clear cart in Supabase
          if (session) {
            set({ isLoading: true })
            
            const { error } = await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', session.user.id)
            
            if (error) throw error
          }
        } catch (error: any) {
          console.error('Error clearing cart:', error)
          set({ error: error.message, isLoading: false })
        } finally {
          set({ isLoading: false })
        }
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
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
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
              user_id: session.user.id,
              status: 'pending',
              total_amount: getCartTotal(),
              shipping_address: shippingAddress,
              payment_status: 'pending',
              payment_method: paymentMethod,
              shipping_cost: getCartTotal() > 100 ? 0 : 10
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
            price_per_unit: item.price
          }))
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)
          
          if (itemsError) {
            throw itemsError
          }
          
          // Get user email for sending invoice
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', session.user.id)
            .single()
          
          // Send invoice email
          if (userProfile?.email) {
            await supabase.functions.invoke('send-invoice', {
              body: { 
                orderId: order.id, 
                userEmail: userProfile.email 
              }
            })
          }
          
          // Clear cart after successful checkout
          await clearCart()
          
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
