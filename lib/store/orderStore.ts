import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product: {
    name: string
    image_url: string | null
  }
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
  updated_at: string
  items: OrderItem[]
  user?: {
    full_name: string | null
    email: string | null
  }
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchUserOrders: (userId: string) => Promise<void>
  fetchAllOrders: () => Promise<void>
  fetchOrderById: (orderId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
  confirmPayment: (orderId: string) => Promise<void>
  sendInvoice: (orderId: string) => Promise<void>
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  
  fetchUserOrders: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(name, image_url)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      set({ 
        orders: data as unknown as Order[], 
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Fetch user orders error:', error)
      set({ isLoading: false, error: error.message })
    }
  },
  
  fetchAllOrders: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(
            id,
            name,
            email
          ),
          items:order_items(
            *,
            product:products(name, image_url)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      set({ 
        orders: data as unknown as Order[], 
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Fetch all orders error:', error)
      set({ isLoading: false, error: error.message })
    }
  },
  
  fetchOrderById: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(
            id,
            name,
            email
          ),
          items:order_items(
            *,
            product:products(name, image_url)
          )
        `)
        .eq('id', orderId)
        .single()
      
      if (error) {
        throw error
      }
      
      set({ 
        currentOrder: data as unknown as Order, 
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Fetch order by ID error:', error)
      set({ isLoading: false, error: error.message })
    }
  },
  
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
      
      if (error) {
        throw error
      }
      
      // Update local state
      const { orders, currentOrder } = get()
      
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status, updated_at: new Date().toISOString() } 
          : order
      )
      
      const updatedCurrentOrder = currentOrder && currentOrder.id === orderId
        ? { ...currentOrder, status, updated_at: new Date().toISOString() }
        : currentOrder
      
      set({ 
        orders: updatedOrders, 
        currentOrder: updatedCurrentOrder,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Update order status error:', error)
      set({ isLoading: false, error: error.message })
    }
  },
  
  confirmPayment: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid' as const, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
      
      if (error) {
        throw error
      }
      
      // Update local state
      const { orders, currentOrder } = get()
      
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, payment_status: 'paid' as const, updated_at: new Date().toISOString() } 
          : order
      )
      
      const updatedCurrentOrder = currentOrder && currentOrder.id === orderId
        ? { ...currentOrder, payment_status: 'paid' as const, updated_at: new Date().toISOString() }
        : currentOrder
      
      set({ 
        orders: updatedOrders, 
        currentOrder: updatedCurrentOrder,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Confirm payment error:', error)
      set({ isLoading: false, error: error.message })
    }
  },
  
  sendInvoice: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      // Call Supabase Edge Function to send invoice
      const { error } = await supabase.functions.invoke('send-invoice', {
        body: { orderId }
      })
      
      if (error) {
        throw error
      }
      
      set({ isLoading: false })
    } catch (error: any) {
      console.error('Send invoice error:', error)
      set({ isLoading: false, error: error.message })
    }
  }
}))

