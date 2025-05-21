import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  
  // Actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product, quantity) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
          // Update quantity if product already exists in cart
          set({
            cart: cart.map(item => 
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          // Add new product to cart
          set({
            cart: [...cart, { product, quantity }],
          });
        }
      },
      
      removeFromCart: (productId) => {
        const { cart } = get();
        set({
          cart: cart.filter(item => item.product.id !== productId),
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        set({
          cart: cart.map(item => 
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      
      clearCart: () => {
        set({ cart: [] });
      },
      
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          return total + (item.product.price * item.quantity);
        }, 0);
      },
      
      getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => {
          return count + item.quantity;
        }, 0);
      },
    }),
    {
      name: 'kg-components-cart',
    }
  )
);

