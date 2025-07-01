import { Database } from './supabase'

export type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  product: Database['public']['Tables']['products']['Row']
}

export type CartWithProducts = {
  items: CartItem[]
  totalItems: number
  subtotal: number
}

export type CartItemWithProduct = {
  id: string
  product_id: string
  user_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
  }
}

