
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { CartItem, Product } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "./authStore";

interface CartState {
  items: (CartItem & { product: Product & { category: { name: string; id: string } | null } })[];
  isLoading: boolean;
  total: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  total: 0,

  fetchCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ items: [], total: 0 });
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(
            *,
            category:categories(
              id, name
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart:", error);
        return;
      }

      set({ items: data || [] });
      get().calculateTotal();
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    set({ isLoading: true });
    try {
      // Check if product already in cart
      const existingItem = get().items.find(item => item.product_id === productId);

      if (existingItem) {
        // Update quantity of existing item
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
          .select(`
            *,
            product:products(
              *,
              category:categories(
                id, name
              )
            )
          `)
          .single();

        if (error) {
          console.error("Error updating cart:", error);
          toast({
            title: "Failed to update cart",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        const updatedItems = get().items.map(item => 
          item.id === data.id ? data : item
        );
        
        set({ items: updatedItems });
      } else {
        // Add new item to cart
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          })
          .select(`
            *,
            product:products(
              *,
              category:categories(
                id, name
              )
            )
          `)
          .single();

        if (error) {
          console.error("Error adding to cart:", error);
          toast({
            title: "Failed to add item",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        set({ items: [...get().items, data] });
      }

      get().calculateTotal();
      toast({
        title: "Item added to cart",
        description: "The item has been added to your cart",
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to add item",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (id, quantity) => {
    if (quantity < 1) {
      return get().removeFromCart(id);
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", id)
        .select(`
          *,
          product:products(
            *,
            category:categories(
              id, name
            )
          )
        `)
        .single();

      if (error) {
        console.error("Error updating cart:", error);
        toast({
          title: "Failed to update cart",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const updatedItems = get().items.map(item => 
        item.id === id ? data : item
      );
      
      set({ items: updatedItems });
      get().calculateTotal();
    } catch (error) {
      console.error("Update quantity error:", error);
      toast({
        title: "Failed to update quantity",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error removing from cart:", error);
        toast({
          title: "Failed to remove item",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const updatedItems = get().items.filter(item => item.id !== id);
      set({ items: updatedItems });
      get().calculateTotal();
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast({
        title: "Failed to remove item",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing cart:", error);
        toast({
          title: "Failed to clear cart",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      set({ items: [], total: 0 });
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared",
      });
    } catch (error) {
      console.error("Clear cart error:", error);
      toast({
        title: "Failed to clear cart",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateTotal: () => {
    const total = get().items.reduce(
      (sum, item) => sum + (Number(item.product.price) * item.quantity),
      0
    );
    set({ total });
  },
}));
