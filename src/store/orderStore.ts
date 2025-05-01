
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderWithItems } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "./authStore";
import { useCartStore } from "./cartStore";

interface OrderState {
  orders: OrderWithItems[];
  isLoading: boolean;
  createOrder: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  sendInvoice: (orderId: string) => Promise<void>;
  confirmPayment: (orderId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,

  createOrder: async () => {
    const user = useAuthStore.getState().user;
    const cart = useCartStore.getState();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to place an order",
        variant: "destructive",
      });
      return;
    }

    if (cart.items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before checking out.",
        variant: "destructive",
      });
      return;
    }

    set({ isLoading: true });
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          total_amount: cart.total,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        toast({
          title: "Order failed",
          description: orderError.message,
          variant: "destructive",
        });
        return;
      }

      // Create order items
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_per_unit: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        toast({
          title: "Order processing failed",
          description: itemsError.message,
          variant: "destructive",
        });
        return;
      }

      // Clear cart after successful order
      await cart.clearCart();

      // Refresh orders
      await get().fetchUserOrders();

      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is being processed",
      });
    } catch (error) {
      console.error("Create order error:", error);
      toast({
        title: "Order failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserOrders: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      set({ orders: data || [] });
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllOrders: async () => {
    const isAdmin = useAuthStore.getState().isAdmin;
    if (!isAdmin) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all orders:", error);
        return;
      }

      set({ orders: data || [] });
    } catch (error) {
      console.error("All orders fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Refresh orders
      const isAdmin = useAuthStore.getState().isAdmin;
      if (isAdmin) {
        await get().fetchAllOrders();
      } else {
        await get().fetchUserOrders();
      }

      toast({
        title: "Order updated",
        description: `Order status has been updated to ${status}`,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  sendInvoice: async (orderId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from("orders")
        .update({ invoice_sent: true })
        .eq("id", orderId);

      if (error) {
        console.error("Error marking invoice as sent:", error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Refresh orders
      const isAdmin = useAuthStore.getState().isAdmin;
      if (isAdmin) {
        await get().fetchAllOrders();
      } else {
        await get().fetchUserOrders();
      }

      toast({
        title: "Invoice sent",
        description: "The invoice has been marked as sent",
      });
    } catch (error) {
      console.error("Send invoice error:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  confirmPayment: async (orderId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_confirmed: true })
        .eq("id", orderId);

      if (error) {
        console.error("Error confirming payment:", error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Refresh orders
      const isAdmin = useAuthStore.getState().isAdmin;
      if (isAdmin) {
        await get().fetchAllOrders();
      } else {
        await get().fetchUserOrders();
      }

      toast({
        title: "Payment confirmed",
        description: "The payment has been marked as confirmed",
      });
    } catch (error) {
      console.error("Confirm payment error:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
