
import { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"user_profiles">;
export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type CartItem = Tables<"cart_items">;

export type ProductWithCategory = Product & {
  category: Category;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};
